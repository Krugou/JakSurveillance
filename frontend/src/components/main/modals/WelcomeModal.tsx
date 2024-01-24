import React, {useEffect, useState} from 'react';

/**
 * WelcomeModal component.
 * This component is responsible for displaying a welcome modal for first-time visitors.
 * It uses the useState and useEffect hooks from React to manage state and side effects.
 * The component checks if the user has visited the site before by checking the 'firstVisit' item in localStorage.
 * If the 'firstVisit' item does not exist, the component assumes that the user is a first-time visitor and displays the welcome modal.
 * The welcome modal contains a welcome message and a close button.
 * When the close button is clicked, the modal is hidden.
 *
 * @returns {JSX.Element} The rendered WelcomeModal component.
 */
const WelcomeModal = () => {
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const firstVisit = localStorage.getItem('firstVisit');
		if (!firstVisit) {
			setShowModal(true);
			localStorage.setItem('firstVisit', 'no');
		}
	}, []);

	return (
		showModal && (
			<div className="fixed bottom-0 right-0 m-6 z-50 bg-white rounded-lg p-6 shadow-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
				<div>
					<h2 className="text-2xl font-bold mb-2">
						Welcome to JakSec! its your first time here
					</h2>
					<p className="mb-4">
						If you ever find yourself unsure of what to do, head over to our
						Instruction Videos section. There, you'll find comprehensive guides to
						help you make the most of JakSec.
					</p>
					<button
						className="bg-blue-500 text-white rounded px-4 py-2"
						onClick={() => setShowModal(false)}
					>
						Close
					</button>
				</div>
			</div>
		)
	);
};

export default WelcomeModal;
