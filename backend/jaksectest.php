<?php
function ldap_authenticate($unixid = '', $passwd = '') {
    $ldapconfig['host'] = 'sedi.metropolia.fi';
    $ldapconfig['port'] = 389;
    $ldapconfig['basedn'] = 'ou=people,dc=metropolia,dc=fi';
    $return = FALSE;

    if ($ds = @ldap_connect($ldapconfig['host'], $ldapconfig['port'])) {
        if (@ldap_bind($ds, 'cn=' . $unixid . ',' . $ldapconfig['basedn'], $passwd)) {
            if ($r = @ldap_search($ds, $ldapconfig['basedn'], 'uid=' . $unixid)) {
                if ($r) {
                    $result = @ldap_get_entries($ds, $r);
                    if ($result[0]) {
                        if (@ldap_bind($ds, $result[0]['dn'], $passwd)) {
                            $return = TRUE;
                        }
                    }
                }
            }
        }
    }

    return $return;
}

if (isset($_POST['login'])) {
    $staff = false;
    $user = $_POST['j_username'];
    $pwd = $_POST['j_password'];

    if ($pwd == '') {
        $pwd = 'aa';
    }

    $ldapconfig['host'] = 'sedi.metropolia.fi';
    $ldapconfig['port'] = 389;
    $ldapconfig['basedn'] = 'ou=people,dc=metropolia,dc=fi';

    if (ldap_authenticate($user, $pwd)) {
        if ($ds = @ldap_connect($ldapconfig['host'], $ldapconfig['port'])) {
            if (ldap_bind($ds, 'cn=' . $user . ',' . $ldapconfig['basedn'], $pwd)) {
                if ($r = @ldap_search($ds, $ldapconfig['basedn'], 'uid=' . $user)) {
                    $result = @ldap_get_entries($ds, $r);

                    if ($result[0]) {
                        foreach ($result[0]['ownrole'] as $value) {
                            if ($value == 'metropolia.staff') {
                                $staff = true;
                            }
                        }

                        if ($staff) {
                            $_SESSION['level'] = '2';
                            $_SESSION['uname'] = $user;
                            $_SESSION['fname'] = $result[0]['givenname'][0];
                            $_SESSION['lname'] = $result[0]['sn'][0];
                            $data = array();
                            $data['user'] = $user;
                            $data['firstname'] = $result[0]['givenname'][0];
                            $data['lastname'] = $result[0]['sn'][0];
                            $data['email'] = $result[0]['mail'][0];
                            $sql = "SELECT * FROM st_teachers WHERE code = '" . $user . "';";
                            $STH = $DBH->query($sql);
                            if ($STH->rowCount() == 0) {
                                // Handle teacher data
                            } else {
                                // Handle student data
                            }
                        }
                    } else {
                        echo "no result";
                    }
                } else {
                    echo "ldapsearch not set";
                }
            } else {
                echo "ldapbind not set";
            }
        } else {
            echo "ldapconnect not set";
        }
    } else {
        // Handle authentication error
    }
} else {
    // Handle form submission error
}
?>
