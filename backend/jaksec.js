import bodyParser from 'body-parser';
import express from 'express';
import ldap from 'ldapjs';
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const ldapconfig = {
	url: 'ldap://sedi.metropolia.fi:389',
	baseDN: 'ou=people,dc=metropolia,dc=fi',
};

function ldap_authenticate(unixid = '', passwd = '') {
	return new Promise((resolve, reject) => {
		const client = ldap.createClient({
			url: ldapconfig.url,
		});

		client.bind(`cn=${unixid},${ldapconfig.baseDN}`, passwd, (err) => {
			if (err) {
				reject(err);
			} else {
				const opts = {
					filter: `(uid=${unixid})`,
					scope: 'sub',
				};

				client.search(ldapconfig.baseDN, opts, (err, res) => {
					if (err) {
						reject(err);
					} else {
						res.on('searchEntry', (entry) => {
							if (entry.object) {
								resolve(true);
							}
						});
						res.on('error', (err) => {
							reject(err);
						});
						res.on('end', (result) => {
							if (result.status !== 0) {
								reject(`non-zero status from LDAP search: ${result.status}`);
							}
						});
					}
				});
			}
		});
	});
}

// Usage
app.use(express.json());

app.post('/login', async (req, res) => {
	const {j_username: user, j_password: pwd} = req.body;
	try {
		const isAuthenticated = await ldap_authenticate(user, pwd);
		if (isAuthenticated) {
			// Handle successful authentication
			res.json({message: 'Authenticated'});
		} else {
			// Handle failed authentication
			res.status(401).json({message: 'Authentication failed'});
		}
	} catch (err) {
		// Handle error
		res.status(500).json({message: 'Server error'});
	}
});
ldap_authenticate('testuser', 'testpassword')
	.then(() => console.log('LDAP connection test successful'))
	.catch((err) => console.error('LDAP connection test failed:', err));
app.listen(3000, () => console.log('Server started on port 3000'));
