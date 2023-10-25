<?php
function ldap_authenticate($unixid = '', $passwd = '') {
    $ldapconfig['host'] = 'sedi.metropolia.fi';
    $ldapconfig['port'] = 389;
    $ldapconfig['basedn'] = 'ou=people,dc=metropolia, dc=fi';
    $return = FALSE;

    $ds = @ldap_connect($ldapconfig['host'],$ldapconfig['port']);
    if ($ds) {
        @ldap_bind($ds, 'cn='.$unixid.','.$ldapconfig['basedn'], $passwd);
        $r = @ldap_search($ds, $ldapconfig['basedn'], 'uid=' . $unixid);
        if ($r) {
            $result = @ldap_get_entries($ds, $r);
            if ($result[0]) {
                if (@ldap_bind($ds, $result[0]['dn'], $passwd)) {
                    $return = TRUE;
                }
            }
        }
    }
    return $return;
}

if (isset($_POST['login'])) {
    $user = $_POST['j_username'];
    $pwd = $_POST['j_password'];
    if ($pwd == '') $pwd = 'aa';

    if (ldap_authenticate($user, $pwd)) {
        // Fetch user details and handle accordingly
    } else {
        // Handle authentication error
    }
}
?>