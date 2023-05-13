<?php
    $ip = $_SERVER["REMOTE_ADDR"];
    $cmd = "sudo /root/captif_on.sh $ip";
    shell_exec($cmd);
    echo "Utilisateur déconnecté";
?>
