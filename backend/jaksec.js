import bodyParser from 'body-parser';
import express from 'express';
import ldap from 'ldapjs';
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.post('/login', (req, res) => {
	let staff = false;
	let user = req.body.j_username;
	let pwd = req.body.j_password || 'aa';

	let ldapconfig = {
		url: 'ldap://sedi.metropolia.fi:389',
		baseDN: 'ou=people,dc=metropolia, dc=fi',
	};

	let client = ldap.createClient({
		url: ldapconfig.url,
	});

	client.bind('cn=' + user + ',' + ldapconfig.baseDN, pwd, function (err) {
		if (err) {
			console.log('Error in bind: ', err);
			res.send('ldapbind not set');
		} else {
			let opts = {
				filter: 'uid=' + user,
				scope: 'sub',
				attributes: ['dn', 'sn', 'cn', 'givenname', 'mail', 'ownrole'],
			};

			client.search(ldapconfig.baseDN, opts, function (err, search) {
				if (err) {
					console.log('Error in search: ', err);
					res.send('ldapsearch not set');
				} else {
					search.on('searchEntry', function (entry) {
						let result = entry.object;
						if (result) {
							if (result.ownrole.includes('metropolia.staff')) {
								staff = true;
							}
							if (staff) {
								// Handle staff login
								// Add your database logic here
							} else {
								// Handle normal user login
								// Add your database logic here
							}
						} else {
							res.send('no result');
						}
					});
				}
			});
		}
	});
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
