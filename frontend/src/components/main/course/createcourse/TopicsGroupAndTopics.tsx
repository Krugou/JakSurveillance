import { CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';

interface Props {
	setTopicsFormData: React.Dispatch<React.SetStateAction<unknown>>;
}
interface TopicGroup {
	topics: string;
	// define the properties of TopicGroup here
	topicgroupname: string;
	// other properties...
}
const TopicGroupAndTopicsSelector: React.FC<Props> = ({setTopicsFormData}) => {
	const {user} = useContext(UserContext);
	const [topicData, setTopicData] = useState<TopicGroup[]>([]);
	const [courseTopicGroup, setCourseTopicGroup] = useState('');
	const [selectedGroupTopics, setSelectedGroupTopics] = useState<string[]>([]);
	const [courseTopics, setCourseTopics] = useState<string[]>([]);
	const [customTopics, setCustomTopics] = useState<string[]>(['']);
	const [customTopicGroup, setCustomTopicGroup] = useState('');
	const [customTopic, setCustomTopic] = useState('');
	const [isCustomGroup, setIsCustomGroup] = useState(false);
	const [loading, setLoading] = useState(true);
	const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedTopics = Array.from(
			e.target.selectedOptions,
			option => option.value,
		);
		setCourseTopics(selectedTopics);

		let topicGroup = '';
		let topics = '';
		if (isCustomGroup) {
			topicGroup = customTopicGroup;
			topics = JSON.stringify(customTopics);
		} else {
			topicGroup = courseTopicGroup;
			topics = JSON.stringify(selectedTopics);
		}

		interface FormData {
			topicgroup: string;
			topics: string;
			// include other properties of form data here
		}

		setTopicsFormData((prevFormData: FormData) => ({
			...prevFormData,
			topicgroup: topicGroup,
			topics: topics,
		}));
	};

	const handleCustomTopicChange = (index: number, value: string) => {
		const newTopics = [...customTopics];
		newTopics[index] = value;
		setCustomTopics(newTopics);
	};
	useEffect(() => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		if (user) {
			apiHooks
				.getAllTopicGroupsAndTopicsInsideThemByUserid(user.email, token)
				.then(data => {
					setTopicData(data);
					if (data.length > 0) {
						setCourseTopicGroup(data[data.length - 1].topicgroupname);
					} else {
						setIsCustomGroup(true);
					}
					setLoading(false);
				});
		}
	}, [user, isCustomGroup]);
	const handleApply = () => {
		event?.preventDefault();
		const topics = customTopics;
		const topicGroup = customTopicGroup;
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		if (user) {
			// Check if any of the custom topics are empty
			const emptyTopic = topics.find(topic => topic.trim() === '');
			if (emptyTopic !== undefined) {
				toast.error('Please fill all empty custom topics before applying.');
				return;
			}
			apiHooks
				.updateOwnedTopicgroupandtheirtopics(topicGroup, topics, user.email, token)
				.then(response => {
					if (response.state === 'success') {
						toast.success('Topic group saved successfully for ' + response.email);
						setIsCustomGroup(false);
						setCustomTopics(['']);
						setCustomTopicGroup('');
					}
				})
				.catch(error => {
					error.message
						? toast.error(error.message)
						: toast.error('Error updating topic group');
					console.error(error);
				});
		}
	};

	useEffect(() => {
		const selectedGroup = topicData.find(
			(group: TopicGroup) => group.topicgroupname === courseTopicGroup,
		);
		const selectedTopics = selectedGroup ? selectedGroup.topics.split(',') : [];
		setSelectedGroupTopics(selectedTopics);

		let topicGroup = '';
		let topics = '';
		if (isCustomGroup) {
			topicGroup = customTopicGroup;
			topics = JSON.stringify(customTopics);
		} else {
			topicGroup = courseTopicGroup;
			topics = JSON.stringify(selectedTopics);
		}

		interface FormData {
			topicgroup: string;
			topics: string;
			// other properties...
		}

		setTopicsFormData((prevFormData: FormData) => ({
			...prevFormData,
			topicgroup: topicGroup,
			topics: topics,
		}));
	}, [
		courseTopicGroup,
		isCustomGroup,
		customTopicGroup,
		customTopics,
		topicData,
	]);
	if (loading) {
		return <CircularProgress />;
	}
	return (
		<fieldset>
			<div className="flex justify-between items-center">
				<h2 className="text-xl mb-3 ">Topic Details</h2>

				{topicData.length > 0 && (
					<button
						type="button"
						onClick={() => setIsCustomGroup(prev => !prev)}
						className="mb-3 w-fit text-sm p-2 bg-metropoliaMainOrange text-white rounded-3xl hover:bg-metropoliaSecondaryOrange"
					>
						{isCustomGroup ? 'Select Existing Group' : 'Create Custom Group'}
					</button>
				)}
			</div>

			{isCustomGroup ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed border-2 bg-gray-200 p-3 border-metropoliaMainOrange">
						<div>
							<label htmlFor="customTopicGroup" className="block font-semibold mb-1">
								Custom Topic Group
							</label>
							<input
								required
								id="customTopicGroup"
								type="text"
								placeholder="Custom Topic Group"
								value={customTopicGroup}
								onChange={e => setCustomTopicGroup(e.target.value)}
								className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
								title='add custom topic group here example: "customGroup"'
							/>
							<button
								className="mb-3 w-fit p-2 bg-metropoliaMainOrange text-white text-sm rounded-3xl hover:bg-metropoliaSecondaryOrange"
								onClick={handleApply}
							>
								Apply
							</button>
						</div>
						<div>
							<label htmlFor="customTopics" className="block font-semibold mb-1">
								Custom Topics
							</label>
							<div className="flex flex-col gap-4 w-full">
								{customTopics.map((topic, index) => (
									<div key={index} className="flex items-center">
										<input
											required
											id={`customTopics-${index}`}
											type="text"
											placeholder="Custom Topic"
											value={topic}
											onChange={e => handleCustomTopicChange(index, e.target.value)}
											className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange mr-2"
											title='add custom topics here example: "exam"'
										/>
										{customTopics.length > 1 && (
											<button
												type="button"
												onClick={() => {
													setCustomTopics(prevTopics =>
														prevTopics.filter((_, i) => i !== index),
													);
												}}
												className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
												title="Remove custom topic"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor"
													className="w-4 h-4"
												>
													<path
														fillRule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 8.586l-2.293-2.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
														clipRule="evenodd"
													/>
												</svg>
											</button>
										)}
									</div>
								))}
								<button
									type="button"
									onClick={() => {
										setCustomTopics(prevTopics => [...prevTopics, customTopic]);
										setCustomTopic('');
									}}
									className="mb-3 w-fit p-2 bg-metropoliaMainOrange text-white text-sm rounded-3xl hover:bg-metropoliaSecondaryOrange"
								>
									Add Custom Topic
								</button>
							</div>
						</div>
					</div>
				</>
			) : (
				// Form fields for selecting an existing group
				<>
					<select
						title="Select Course Topic Group"
						value={courseTopicGroup}
						onChange={e => setCourseTopicGroup(e.target.value)}
						className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
					>
						{topicData.map((group, index) => (
							<option key={index} value={group.topicgroupname}>
								{group.topicgroupname}
							</option>
						))}
					</select>
					<div className="border border-gray-200 ">
						{selectedGroupTopics.map((topic, index) => (
							<div
								key={index}
								className={`p-4 text-metropoliaSupportWhite ${
									index % 2 === 0
										? 'bg-metropoliaMainOrange'
										: 'bg-metropoliaSecondaryOrange'
								}`}
							>
								{topic}
							</div>
						))}
					</div>
				</>
			)}
		</fieldset>
	);
};

export default TopicGroupAndTopicsSelector;
