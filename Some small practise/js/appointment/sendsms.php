<?php

require __DIR__.'/redsms/RedsmsApiSimple.php';

$ajaxresponse = [
    "error" => 0,
    "data" => 0,
    ];

$isOK = true;

if ($_SERVER["REQUEST_METHOD"] == "POST"){

    $code = "";
    $mobile = "";

    if (isset($_POST["code"])){
        if (empty($_POST["code"])){
            $ajaxresponse["error"][] = "empty field: code";
            $isOK = false;
        }else{
            $code = $_POST["code"];
        }
    }else{
        $ajaxresponse["error"][] = "field: code does not exist";
        $isOK = false;
    }

    if (isset($_POST["mobile"])){
        if (empty($_POST["mobile"])){
            $ajaxresponse["error"][] = "empty field: mobile";
            $isOK = false;
        }else{
            $mobile = $_POST["mobile"];
        }
    }else{
        $ajaxresponse["error"][] = "field: mobile does not exist";
        $isOK = false;
    }

    if ($isOK){
        $config = include __DIR__.'/redsms/config.php';
        $redsmsApi = new \Redsms\RedsmsApiSimple($config['login'], $config['apiKey']);

        $text = "Ваш проверочный код: $code";

        try {
//            $sendResult = $redsmsApi->sendSMS($mobile, $text, $config['smsSenderName']);
            $sendResult = $redsmsApi->testing($mobile, $text, $config['smsSenderName']);
            if (!empty($sendResult['items']) && $messages = $sendResult['items'] ) {
                foreach ($messages as $message) {
                    $ajaxresponse["data"] = $message["status"];
                    break;
                }
            }
        } catch (\Exception $e) {
            $ajaxresponse["error"][$e->getCode()] = $e->getMessage();
        }
    }
}

$ajaxresponse = json_encode($ajaxresponse);
echo $ajaxresponse;
exit();