<?php
class MY_Input extends CI_Input {

    var $delete;
    var $put;

    function __construct() {
        parent::__construct();

        if ($this->server('REQUEST_METHOD') == 'DELETE') {
            parse_str(file_get_contents('php://input'), $this->delete);

            $this->delete = $this->_clean_input_data($this->delete);
        } elseif ($this->server('REQUEST_METHOD') == 'PUT') {
            parse_str(file_get_contents('php://input'), $this->put);
            //var_dump(parse_str(file_get_contents("php://input")));
            echo "--";
            var_dump($this->put);
            $this->put = $this->_clean_input_data($this->put);
            var_dump($this->put);
        }
    }

    function delete($index = '', $xss_clean = FALSE) {
        return $this->_fetch_from_array($this->delete, $index, $xss_clean);
    }

    function put($index = '', $xss_clean = FALSE) {
        return $this->_fetch_from_array($this->put, $index, $xss_clean);
    }

    function _clean_input_keys($str)
    {
        /*if ( ! preg_match("/^[a-z0-9:_\/-]+$/i", $str))
        {
            exit('Disallowed Key Characters.');
        }*/

        return $str;
    }

}
?> 