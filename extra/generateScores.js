import {Octokit} from '@octokit/rest';
import dotenv from 'dotenv';
import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

dotenv.config();
const owner = 'Krugou'; // replace with repository owner
const repo = 'JakSurveillance'; // replace with repository name
// console.log(process.env.GITHUBTOKEN);
const octokit = new Octokit({auth: process.env.GITHUBTOKEN});
const getContributorsStats = async () => {
	while (true) {
		const response = await octokit.rest.repos.getContributorsStats({
			owner,
			repo,
		});

		if (response.status === 200 && Array.isArray(response.data)) {
			return response.data;
		}

		console.log('Waiting for stats to be ready...');
		await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds before retrying
	}
};
const generateScores = async () => {
	const contributors = await getContributorsStats();
	console.log(contributors);
	const scores = {};

	for (const contributor of contributors) {
		console.log('Processing contributor:', contributor.author.login);

		const login = contributor.author.login;
		const commits = contributor.total;
		const additions = contributor.weeks.reduce(
			(total, week) => total + week.a,
			0
		);
		const deletions = contributor.weeks.reduce(
			(total, week) => total + week.d,
			0
		);
		const totalChanges = additions - deletions;

		console.log(
			`Scores for ${login}: commits - ${commits}, additions - ${additions}, deletions - ${deletions}, total changes - ${totalChanges}`
		);

		scores[login] = {
			commits: commits,
			additions: additions,
			deletions: deletions,
			totalChanges: totalChanges,
		};
	}

	try {
		fs.writeFileSync('scores.json', JSON.stringify(scores, null, 2));
		console.log('Successfully wrote to scores.json');
	} catch (error) {
		console.error('Error writing to scores.json:', error);
	}
};

// generateScores().catch(console.error);

const __dirname = dirname(fileURLToPath(import.meta.url));

// Get an array of filenames in the current directory
const filenames = fs.readdirSync(__dirname);

// Filter the filenames for .drawio and .png files
const filteredFilenames = filenames.filter(
	(filename) =>
		path.extname(filename) === '.drawio' || path.extname(filename) === '.png'
);

// Write the object to the JSON file
fs.writeFileSync(
	path.join(__dirname, 'links.json'),
	JSON.stringify(filteredFilenames, null, 2)
);
