import EditIcon from '@mui/icons-material/Edit';
import {Card, CardContent, Grid, Tooltip, Typography} from '@mui/material';
import React from 'react';
import {useNavigate} from 'react-router-dom';

interface SimpleUserViewProps {
	user: {
		GDPR: number;
		created_at: string;
		email: string;
		first_name: string;
		last_name: string;
		role: string;
		roleid: number;
		staff: number;
		studentgroupid: number;
		studentnumber: number;
		userid: number;
		username: string;
	};
}

const SimpleUserView: React.FC<SimpleUserViewProps> = ({user}) => {
	const navigate = useNavigate();

	return (
		<Card className="m-4">
			<CardContent>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={12}>
						<Typography variant="h5" component="div" className="flex justify-between" gutterBottom>
							{user.role}
							<Tooltip title="Modify this course">
								<EditIcon
									fontSize="large"
									className="cursor-pointer"
									onClick={() => navigate(`./modify`)}
								/>
							</Tooltip>
						</Typography>
						<Typography variant="body1" gutterBottom>First Name: {user.first_name}</Typography>
						<Typography variant="body1" gutterBottom>Last Name: {user.last_name}</Typography>
						<Typography variant="body1" gutterBottom>Email: {user.email}</Typography>
						<Typography variant="body1" gutterBottom>
							Student Number: {user.studentnumber}
						</Typography>
						<Typography variant="body1" gutterBottom>User ID: {user.userid}</Typography>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default SimpleUserView;
