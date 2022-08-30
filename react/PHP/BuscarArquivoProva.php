<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

$data = array('codigoProva'=>$_GET["codigoProva"]);
$url = "http://teste.sunsalesystem.com.br/api/concursando/provas/getArquivoProva?" . http_build_query($data);
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

echo $resp;

?>