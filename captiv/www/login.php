<?php
    $ip = $_SERVER["REMOTE_ADDR"];
    $cmd = "sudo /root/captif_off.sh $ip";
    shell_exec($cmd);
    echo "Utilisateur déconnecté";
?>
