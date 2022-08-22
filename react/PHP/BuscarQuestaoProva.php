<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

$data = array('codigoProva'=>$_GET["codigoProva"]);
$data2 = array('ultimaQuestao'=>$_GET["ultimaQuestao"]);
$data3 = array('codigoUsuario'=>$_GET["codigoUsuario"]);
$url = "http://teste.sunsalesystem.com.br/api/concursando/questoes/getQuestoesPorProva?" . http_build_query($data) . "&" . http_build_query($data2) . "&" . http_build_query($data3);
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

echo $resp;

?>