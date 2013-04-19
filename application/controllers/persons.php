<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Persons extends CI_Controller {

    public function index($id = null) {
        $method = $this->input->server('REQUEST_METHOD');
        if($id) {
            if($method == 'PUT') { //update item
                $this->put($id, $this->input->put); 
            } else if($method == 'DELETE'){
                $this->delete($id);
            } else { //get specific item
                $this->get($id);
            }
        } else {
            if($method == 'POST') { //create item
                $this->post();
            } else { //get all the items
                $this->get();
            }
        }
    }

    public function get($id = null) {
        $this->load->database();
        $this->db->from("person");

        if($id) {
            $this->db->where("id", $id);
        }

        $res = $this->db->get();
        $res = $res->result_array();

        for($i = 0; $i < count($res); $i++) {
            $res[$i]['avatar'] = $this->getAvatar($res[$i]["email"]);
        }

        if($id) {
            $this->load->view("view_json_list", array(
                "data" => $res[0]
            ));    
        } else {
            $this->load->view("view_json_list", array(
                "data" => $res
            ));
        }
        
    }

    public function getAvatar($email, $size = 50) {
        return 'http://www.gravatar.com/avatar/'.md5(strtolower(trim($email)))."?s=".$size;
    }

    public function post() {
        $this->load->database();
        parse_str(file_get_contents('php://input'), $data);
        current($data);
        $data = json_decode(key($data));

        $this->db->insert('person', array(
            'name' => $data->name,
            'email' => $data->email,
            'active' => $data->active
        ));

        $this->load->view("view_json_item", array(
            "data" => array(
                "id" => $this->db->insert_id()
            )
        ));
    }

    public function delete($id) {
        $this->load->database();
        $this->db->delete("person", array(
            "id" => $id
        ));

        $this->load->view("view_json_item", array(
            "data" => array(
                "success" => true
            )
        ));
    }

    public function put($id, $data) {
        $this->load->database();
        $this->db->where(array(
                "id" => $id
            ));
        var_dump($data);
        die();
        current($data);
        var_dump(key($data));
        $data = json_decode(key($data));
        var_dump($data);
        die();
        /*$this->db->update("person", array(
            'name' => $data->name,
            'email' => $data->email,
            'active' => $data->active
        )); */
    }
}