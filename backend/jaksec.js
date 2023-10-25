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
	client.on('connect', function () {
		console.log('Successfully connected to LDAP server');
	});

	client.on('error', function (err) {
		console.error('Unable to connect to LDAP server: ', err);
	});
	client.bind('cn=' + user + ',' + ldapconfig.baseDN, pwd, function (err) {
		if (err) {
			res.send('ldapbind not set');
		} else {
			let opts = {
				filter: 'uid=' + user,
				scope: 'sub',
				attributes: ['dn', 'sn', 'cn', 'givenname', 'mail', 'ownrole'],
			};

			client.search(ldapconfig.baseDN, opts, function (err, search) {
				if (err) {
					res.send('ldapsearch not set');
				} else {
					search.on('searchEntry', function (entry) {
						let result = entry.object;
						if (result) {
							if (result.ownrole.includes('metropolia.staff')) {
								staff = true;
								req.session.level = '2';
								req.session.uname = user;
								req.session.fname = result.givenname;
								req.session.lname = result.sn;
								// Add your database query here
							} else {
								// Handle student data here
							}
						} else {
							res.send('no result');
						}
					});
					search.on('error', function (err) {
						res.send('ldapsearch not set');
					});
				}
			});
		}
	});

	client.on('error', function (err) {
		res.send('ldapconnect not set');
	});
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
