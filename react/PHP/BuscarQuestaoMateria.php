<?php
$data = array('materia'=>$_GET["Materia"]);
$url = "http://teste.sunsalesystem.com.br/api/concursando/questoes/getQuestoesPorMateria?" . http_build_query($data);
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

echo $resp;

?>