"use strict";

var FMastermind = function MasterMind()
{
	let codeMaker = [0, 0, 0, 0];
	let codeBreakerRows = [];
	let feedbackCodeRows = [];
	let guessesLeft = 9;
	let index = 0;
	let indexCM = 0;
	const ROWS = 10;

	function addToCodeMaker(value)
	{
		codeMaker[indexCM++] = value;
	}

	function popToCodeMaker(value)
	{
		codeMaker[--indexCM] = 0;
	}

	function isValueAddedToCodeMaker(value)
	{
		if (indexCM >= 4 || indexCM <= -1)
			return false;

		addToCodeMaker(value);
		return true;
	}

	function isRevertMadeToCodeMaker()
	{
		if (indexCM > 4 || indexCM < 1)
			return false;

		popToCodeMaker();
		return true;
	}


	// when there's new code to be made clear the code breaker and
	// feedbackrow as well since they are connected. or im just lazy.
	function clearCodeMaker()
	{
		for (let i = 0; i < 4; i++) {
			codeMaker[i] = 0;
		}
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 4; j++) {
				codeBreakerRows[i][j] = 0;
				feedbackCodeRows[i][j] = 0;
			}
		}
		index = 0;
		indexCM = 0;
		guessesLeft = 9;
	}
	
	function addToCodeBreaker(value)
	{
		if (indexCM < 4) {
			return;
		}
		if (index > 3) {
			index = 0;
		}
		if (guessesLeft < 0) {
			return;
		}
		codeBreakerRows[guessesLeft][index++] = value;
	}

	// both feedbackcoderows should be identical but no just lazy do
	(function fillCodeBreakerRows()
	{
		for (let row = 0; row < ROWS; row++) {
			codeBreakerRows.push([0, 0, 0, 0]);
			feedbackCodeRows.push([0, 0, 0, 0]);
		}
	})();

	function sortFeedbackCode()
	{
		if (indexCM < 4) {
			return;
		}
		if (guessesLeft < 0)
			return;

		feedbackCodeRows[guessesLeft].sort().reverse();
	}

	function checkCodeBreakerRow()
	{
		let codeBroke = 0;
		let checked = 0;

		if (indexCM <= 3) {
			return false;
		}

		if (index <= 3) {
			return false;
		}

		if (guessesLeft == -1) {
			return false;
		}

		for (let i = 0; i < 4; i++) {
			for (let j = checked; j < 4; j++) {
				if (codeMaker[i] == codeBreakerRows[guessesLeft][j]
					&& i == j) {
					checked++;
					codeBroke++;
					feedbackCodeRows[guessesLeft][j] = 3;
					break;
				}
				if (codeMaker[i] == codeBreakerRows[guessesLeft][j]
					&& i != j) {
					feedbackCodeRows[guessesLeft][j] = 2;
					break;
				}
				feedbackCodeRows[guessesLeft][j] = 1;
			}
		}

		sortFeedbackCode();

		if (codeBroke == 4) {
			// even game is done this is fallback
			guessesLeft--;
			return true;
		}

		guessesLeft--;
		return false;
	}

	return {
		get indexCM() {
			return indexCM;
		},
		get index() {
			return index;
		},
		get guessesLeft() {
			return guessesLeft;
		},
		codeBreakerRows,
		feedbackCodeRows,
		codeMaker,
		isValueAddedToCodeMaker,
		isRevertMadeToCodeMaker,
		clearCodeMaker,
		addToCodeBreaker,
		checkCodeBreakerRow,
		sortFeedbackCode,
	};
};

const fruitElements = (parent, imgSize, codeBreakersDataSet, feedbackCodeDataSet) =>
{
	for (let i = 0; i < 10; i++) {
		const div = document.createElement("div");
		
		div.dataset[codeBreakersDataSet] = `${i}`;

		for (let j = 0; j < 4; j++) {
			const button = document.createElement("button");
			const img = document.createElement("img");

			button.dataset[codeBreakersDataSet] = `${j}`;

			img.width = imgSize;
			img.height = imgSize;
			img.src = "img/placeholder.svg";
			img.dataset[codeBreakersDataSet] = `${j}`;
			button.disabled = true;
			
			button.appendChild(img);
			div.appendChild(button);
		}
		const div2 = document.createElement("div");
		div2.dataset[feedbackCodeDataSet] = `${i}`;
		div2.classList.add("feedbackCodeRows");

		for (let j = 0; j < 4; j++) {
			const button = document.createElement("button");
			const img = document.createElement("img");

			button.dataset[feedbackCodeDataSet] = `${j}`;

			img.width = (imgSize+10)/4;
			img.height = (imgSize+10)/4;
			img.src = "img/placeholder.svg";
			img.dataset[feedbackCodeDataSet] = `${j}`;
			button.disabled = true;
			
			button.appendChild(img);
			div2.appendChild(button);
		}
		
		div.prepend(div2);
		parent.appendChild(div);
	}
}

function showMastermindFruits(mastermind)
{
	mastermind.codeMaker.forEach((element, index) => 
	{
		const fruitCodeIs = document.querySelector(`button[data-fruit-cm="${index}"] > img`); 
		
		switch (element){
		case 1: 
			fruitCodeIs.src = "img/apple.svg";
			break;
		case 2:
			fruitCodeIs.src = "img/strawberry.svg";
			break;
		case 3:
			fruitCodeIs.src = "img/pineapple.svg";
			break;
		case 4:
			fruitCodeIs.src = "img/mango.svg";
			break;
		case 5:
			fruitCodeIs.src = "img/green_grapes.svg";
			break;
		default:
			fruitCodeIs.src = "img/placeholder.svg";
		}
	});
}


function clearCodeBreakers(mastermind)
{
	for (let i = 0; i < 10; i++) {
		mastermind.codeBreakerRows[i].forEach((element, index) => 
		{
			const codeBreakerImg = document.querySelector(`div[data-code-breakers="${i}"] button[data-code-breakers="${index}"] img[data-code-breakers="${index}"]`);

			codeBreakerImg.src = "img/placeholder.svg";
		});
	}
}

function showCodeBreakers(mastermind)
{
	if (mastermind.guessesLeft < 0) {
		return;
	}
	mastermind.codeBreakerRows[mastermind.guessesLeft].forEach((element, index) => 
	{

		const codeBreakerImg = document.querySelector(`div[data-code-breakers="${mastermind.guessesLeft}"] button[data-code-breakers="${index}"] img[data-code-breakers="${index}"]`);

		switch (element){
		case 1: 
			codeBreakerImg.src = "img/apple.svg";
			break;
		case 2:
			codeBreakerImg.src = "img/strawberry.svg";
			break;
		case 3:
			codeBreakerImg.src = "img/pineapple.svg";
			break;
		case 4:
			codeBreakerImg.src = "img/mango.svg";
			break;
		case 5:
			codeBreakerImg.src = "img/green_grapes.svg";
			break;
		default:
			codeBreakerImg.src = "img/placeholder.svg";
		}
	});
}


function showFeedbackCodes(mastermind)
{
	if (mastermind.index <= 3) {
		return;
	}

	mastermind.feedbackCodeRows[mastermind.guessesLeft+1].forEach((element, index) => 
	{
		const feedbackCodeImg = document.querySelector(`div[data-feedback-codes-rows="${mastermind.guessesLeft+1}"] button[data-feedback-codes-rows="${index}"] img[data-feedback-codes-rows="${index}"]`);

		switch (element){
		case 1: 
			feedbackCodeImg.src = "img/white_in_placeholder.svg";
			break;
		case 2:
			feedbackCodeImg.src = "img/black_in_placeholder.svg";
			break;
		case 3:
			feedbackCodeImg.src = "img/black_in_placeholder.svg";
			break;
		}

	});

}


function clearFeedbackCodes(mastermind)
{
	for (let i = 0; i < 10; i++) {

		mastermind.feedbackCodeRows[i].forEach((element, index) => 
		{
			const feedbackCodeImg = document.querySelector(`div[data-feedback-codes-rows="${i}"] button[data-feedback-codes-rows="${index}"] img[data-feedback-codes-rows="${index}"]`);

			feedbackCodeImg.src = "img/placeholder.svg";
		});
	
	}
}

window.onload = (wEvent) =>
{
	const mastermind = FMastermind();

	const codeMaker = document.querySelector(".hideCodeMaker");
	const codeBreakersRows = document.querySelector("div.clues");
	
	fruitElements(codeBreakersRows, 40, "codeBreakers", "feedbackCodesRows");

	const newCodeMadeBtn = document.getElementById("codeMakerGo");
	const closeCMdialog = document.getElementById("closeCMDialog");
	const codeMakerDialog = document.getElementById("codeMakerDialog");
	const pickColorCodes = document.querySelectorAll(".pickColorCodes > button");
	const addFruitCode = document.querySelector("button#addFruitCode");
	const removeFruitCode = document.querySelector("button#removeFruitCode");
	const fruitCodes = document.querySelectorAll("div.codeMaker button.fruitCode");

	// this helps design toggling elements on close and on open
	let pick = 1;

	function newCodeToBeMade(event)
	{
		codeMakerDialog.showModal();

		mastermind.clearCodeMaker();

		clearFeedbackCodes(mastermind);
		clearCodeBreakers(mastermind);
		pick = 1;
		
		document.querySelector(`button[data-fruit-num="${pick}"]`)
		.classList.add("selected");


		fruitCodes.forEach((element) =>
		{
			element.classList.remove("hide");
		});

		showMastermindFruits(mastermind);
	};

	newCodeMadeBtn.addEventListener("click", newCodeToBeMade);

	pickColorCodes.forEach((element, index) =>
	{
		element.addEventListener("click", (eEvent) =>
		{
			document.querySelector(`button[data-fruit-num="${pick}"]`)
			.classList.remove("selected");

			const elementDataset = element.dataset;

			element.classList.add("selected");
			pick = Number(elementDataset.fruitNum);
		});
	});

	// add each fruit as a code maker
	addFruitCode.addEventListener("click", (FCEvent) =>
	{
		const isAdded = mastermind.isValueAddedToCodeMaker(pick);

		if (isAdded) {
			showMastermindFruits(mastermind);
		}
	});

	removeFruitCode.addEventListener("click", (FCEvent) =>
	{
		const isRemoved = mastermind.isRevertMadeToCodeMaker(pick);
		
		if (isRemoved) {
			showMastermindFruits(mastermind);
		}
	});
	
	// that is if there are now 4 picked fruit
	// close the code maker's fruits
	closeCMDialog.addEventListener("click", (event) =>
	{
		codeMakerDialog.close();

		pickColorCodes.forEach((element) =>
		{
			element.classList.remove("selected");

		});


		fruitCodes.forEach((element) =>
		{
			element.classList.add("hide");
		});


		if (mastermind.indexCM < 4) {
			for (let i = 0; i < 4; i++) {
				const fruitCodeIs = document.querySelector(`button[data-fruit-cm="${i}"] > img`); 

				fruitCodeIs.src = "img/placeholder.svg";
			}

		} 	
	});

	const fruitCodeBreakers = document.querySelectorAll("div.colorCodes button.fruitCode");
	const announceWinner = document.querySelector("dialog.winOrLose");
	const announceWinnerH3 = document.querySelector("h3.announceConclusion");
	const announceWinnerP = document.querySelector("p.announceConclusion");

	fruitCodeBreakers.forEach((element) => {
		// mastermind have picked a fruits
		element.addEventListener("click", (btn) => {
			mastermind.addToCodeBreaker(Number(element.dataset.codeBreaker));
			
			showCodeBreakers(mastermind);
			const isWinner = mastermind.checkCodeBreakerRow();

			if (isWinner) {
				announceWinnerH3.textContent = "You Win";
				announceWinnerP.textContent = "Broo lezz goo";
				announceWinner.showModal();

				mastermind.clearCodeMaker();

				clearFeedbackCodes(mastermind);
				clearCodeBreakers(mastermind);
				pick = 1;
				
				document.querySelector(`button[data-fruit-num="${pick}"]`)
				.classList.add("selected");


				fruitCodes.forEach((element) =>
				{
					element.classList.remove("hide");
				});
				for (let i = 0; i < 9; i++) {
					const guessRow =  document.querySelector(`div[data-code-breakers="${i}"]`);
					guessRow.classList.remove("highlight");
				}
			}

			if (mastermind.guessesLeft < 0) {
				announceWinnerH3.textContent = "You lose";
				announceWinnerP.textContent = "mastermind is better predictable";
				announceWinner.showModal();

				mastermind.clearCodeMaker();

				clearFeedbackCodes(mastermind);
				clearCodeBreakers(mastermind);
				pick = 1;
				
				document.querySelector(`button[data-fruit-num="${pick}"]`)
				.classList.add("selected");


				fruitCodes.forEach((element) =>
				{
					element.classList.remove("hide");
				});

				for (let i = 0; i < 9; i++) {
					const guessRow =  document.querySelector(`div[data-code-breakers="${i}"]`);
					guessRow.classList.remove("highlight");
				}
			}

			if (mastermind.guessesLeft >= 0) {
				const currentGuessRow =  document.querySelector(`div[data-code-breakers="${mastermind.guessesLeft}"]`);
				currentGuessRow.classList.add("highlight");


				if (mastermind.guessesLeft < 9) {
					const prevGuessRow =  document.querySelector(`div[data-code-breakers="${mastermind.guessesLeft+1}"]`);

					prevGuessRow.classList.remove("highlight");
				}
			}

			showFeedbackCodes(mastermind);
		});
	});

	document.querySelector("button.closeAnnouncement").addEventListener("click", () => {
		announceWinner.close();
	});
}
