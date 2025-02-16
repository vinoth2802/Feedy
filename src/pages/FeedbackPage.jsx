import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addFeedback } from '../services/ResponseService';

const questions = [
	{ id: 1, sectionId: 1, qn: "Course is relevant for the programme" },
	{ id: 2, sectionId: 1, qn: "Course content is adequate in relation to the Course Outcomes (COs)" },
	{ id: 3, sectionId: 1, qn: "Allocation of the credits to the course is appropriate" },
	{ id: 4, sectionId: 1, qn: "Units/sections in the syllabus are properly sequenced" },
	{ id: 5, sectionId: 1, qn: "Course Reference Books are adequate" },

	{ id: 6, sectionId: 2, qn: "Teacher speaks clearly and audibly" },
	{ id: 7, sectionId: 2, qn: "Teacher provides examples of concept/principles. Explanations are clear and effective" },
	{ id: 8, sectionId: 2, qn: "Teacher writes and draws legibly" },
	{ id: 9, sectionId: 2, qn: "Teacher’s pace and level of instructions are suited to the needs of students" },
	{ id: 10, sectionId: 2, qn: "Teacher offers assistance and counselling to the needy students" },

	{ id: 11, sectionId: 3, qn: "Teacher asks questions to promote interactions and refractive thinking" },
	{ id: 12, sectionId: 3, qn: "Teacher encourages questioning/raising doubts by students and answers them well" },
	{ id: 13, sectionId: 3, qn: "Course improved my ability to formulate, analyze and solve problems" },
	{ id: 14, sectionId: 3, qn: "Teacher encourages, compliments and praises originality and creativity displayed by the student" },
	{ id: 15, sectionId: 3, qn: "Teacher is courteous and impartial in dealing with the student" },

	{ id: 16, sectionId: 4, qn: "Teacher engages class regularly and maintains discipline" },
	{ id: 17, sectionId: 4, qn: "Course enabled understanding of the concepts in relating theory to practice" },
	{ id: 18, sectionId: 4, qn: "Course is intellectually stimulating" },
	{ id: 19, sectionId: 4, qn: "Teacher’s marking of scripts is fair and impartial" },
	{ id: 20, sectionId: 4, qn: "Course evaluation scheme is designed well" }
];

const options = [
	{ option: "Strongly Agree", value: 5 },
	{ option: "Agree", value: 4 },
	{ option: "Neutral", value: 3 },
	{ option: "Disagree", value: 2 },
	{ option: "Strongly Disagree", value: 1 }
];

const sections = [
	{ id: 1, value: "PLANNING AND ORGANIZATION" },
	{ id: 2, value: "PRESENTATION / COMMUNICATION" },
	{ id: 3, value: "STUDENT'S PARTICIPATION" },
	{ id: 4, value: "CLASS MANAGEMENT / ASSESSMENT OF STUDENTS" }
];

const FeedbackPage = () => {

	const [responses, setResponses] = useState({});
	const { courseId, courseCode, courseName } = useParams();
	const [missingValues, setMissingValues] = useState([])
	const studentId = localStorage.getItem("currentUser");
	const navigate = useNavigate();

	const handleSelection = (questionId, value) => {
		setResponses((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateForm()) {
			addFeedback(courseId,studentId, responses)
			.then(response => {
				navigate('/student');
			})
		}
	}

	function validateForm() {
		let missingValuesCopy = [];
		let isValid = true;

		questions.forEach((question) => {
			let qnId = `qn${question.id}`;
			if (!Object.keys(responses).includes(qnId)) {
				missingValuesCopy.push(qnId);
				isValid = false;
			}
		})

		setMissingValues([...missingValuesCopy]);

		return isValid;
	}

	return (
		<div className="container-fluid" style={{ backgroundColor: '#fefae0' }}>
			<div className="row text-center">
				<div className="col-12 mt-3">
					<h2 className="text-center" style={{ color: '#003049' }}>{courseCode + " - " + courseName}</h2>
				</div>
			</div>

			<div className="row mt-3">
				<div className="col-md-6 col-12 mx-auto ">
					<form className='mb-5'>
						{
							sections.map((section) => {
								return (
									<div key={section.id}>
										<h5 style={{ color: '#003049' }}>{section.id + ". " + section.value}</h5>
										<hr />

										{
											questions.filter((question) => question.sectionId === section.id)
												.map((question) => {
													return (
														<div className={`card shadow-sm mb-3 ${!missingValues.includes(`qn${question.id}`) ? 'border-light' : 'border-danger'}`}
															style={{ borderRadius: '1rem' }}>
															<div className="card-body">
																<div className="card-title d-flex gap-2 mb-3">
																	<div>{question.id + "."}</div>
																	<div>{question.qn}</div>
																</div>
																<div className="card-text">
																	{
																		options.map((option) => {
																			return (
																				<div className="form-check p-1 ms-5"
																					key={option.value}
																					onClick={() => handleSelection(`qn${question.id}`, option.value)}
																					style={{ cursor: "pointer" }}
																				>
																					<input type="radio"
																						className="form-check-input"
																						name={`qn${question.id}`}
																						value={option.value}
																						checked={responses[`qn${question.id}`] === option.value}
																						onChange={() => handleSelection(`qn${question.id}`, option.value)}
																						style={{ cursor: "pointer" }}
																					/>
																					<label htmlFor={`qn${question.id}`}
																						className="form-check-label"
																						onClick={() => handleSelection(`qn${question.id}`, option.value)}
																						style={{ cursor: "pointer" }}
																					>
																						{option.option}
																					</label>
																				</div>
																			)
																		})
																	}
																</div>
																{
																	missingValues.includes(`qn${question.id}`) &&
																	<div className='ms-5 text-danger'>
																		*required
																	</div>
																}
															</div>
														</div>
													)
												})
										}

										<br />
									</div>
								)
							})
						}
						<div className="container text-center">
							<button className='btn btn-primary mb-3 text-center w-25'
								style={{
									fontSize: '1.5rem'
								}}
								onClick={handleSubmit}
							>
								Submit
							</button>
						</div>
						{
							missingValues.length !== 0 &&
							<div className="container text-center text-danger">
								Please answer all the questions !
							</div>
						}

					</form>
				</div>
			</div>
		</div>

	);
};


export default FeedbackPage