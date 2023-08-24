
export const metadata = {
	title: 'Chat | CoDriver',
};
const page = (): JSX.Element => {
	const results = ["a", "v", "f", "d"];

// for (const result of results) {
//   const element = Document.createElement("div");
//   element.className = "chat chat-start";

//   const header = document.createElement("div");
//   header.className = "chat-header";
//   header.innerHTML = result;

//   const time = document.createElement("time");
//   time.className = "text-xs opacity-50";
//   time.innerHTML = result;

//   const bubble = document.createElement("div");
//   bubble.className = "chat-bubble";
//   bubble.innerHTML = result;

//   const footer = document.createElement("div");
//   footer.className = "chat-footer opacity-50";
//   footer.innerHTML = result;

//   element.appendChild(header);
//   element.appendChild(time);
//   element.appendChild(bubble);
//   element.appendChild(footer);

//   const app = document.getElementById("app");
// // 2. Create a new <p></p> element programmatically
// // 3. Add the text content
// // 4. Append the p element to the div element
// app?.appendChild(element);

//   document.body.appendChild(element);
// }
	return <div className="h-screen w-full">

			<div className="flex flex-col h-full w-full border-opacity-50 ">
				<div className="grid h-80 card bg-base-300 rounded-box place-items-center" id="app">
					
				</div>
				<div className="divider"></div>
				<div className="grid h-20 card place-items-center">
					<form action="" className="w-full form-control">
					<input type="text" placeholder="Type here" className="input input-bordered w-5/6" />
					<button>Send</button>
					</form>
				</div>
			</div>
	</div>;
};

export default page;
