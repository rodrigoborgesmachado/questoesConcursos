<?php
$data = array('codigoProva'=>$_GET["codigoProva"]);
$data2 = array('ultimaQuestao'=>$_GET["ultimaQuestao"]);
$url = "http://teste.sunsalesystem.com.br/api/concursando/questoes/getQuestoesPorProva?" . http_build_query($data) . "&" . http_build_query($data2);
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

echo $resp;

?>