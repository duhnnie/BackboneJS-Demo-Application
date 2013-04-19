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
        $data = file_get_contents('php://input');
        $data = json_decode($data);
//var_dump($data);
//die();
        $name = trim($data->name);
        $email = trim($data->email);
        $active = trim($data->active);

        $this->db->insert('person', array(
            'name' => $name,
            'email' => $email,
            'active' => $active
        ));

        if($this->db->affected_rows() === 1) {
            $this->load->view("view_json_item", array(
                "data" => array(
                    "id" => $this->db->insert_id(),
                    'name' => $name,
                    'email' => $email,
                    'active' => $active,
                    'avatar' => $this->getAvatar($email)
                )
            ));
        } else {
            $this->load->view("view_json_item", array(
                "data" => array(
                    "success" => false
                )
            ));
        }
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
        $data = json_decode($data);
        $this->load->database();
        $this->db->where(array(
                "id" => $id
            ));
        var_dump($data->active);
        echo $id;
        $this->db->update("person", array(
            'name' => $data->name,
            'email' => $data->email,
            'active' => $data->active
        ));
        echo $this->db->last_query();
    }
}