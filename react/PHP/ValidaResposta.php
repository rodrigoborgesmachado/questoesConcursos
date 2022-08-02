<?php
$url = "http://teste.sunsalesystem.com.br/api/concursando/questoes/ValidaRespostaCorreta?codigoResposta=". htmlspecialchars($_GET["codigoResposta"]);

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

echo $resp;

?>