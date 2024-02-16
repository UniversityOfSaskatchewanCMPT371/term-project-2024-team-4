import { Component } from "react";
import Sidebar from "./Sidebar";

class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				<div className="row">
					<div className="col-3">
						<Sidebar />
					</div>
					<div className="col">
						<div className="container">
							<h2>&lt; Catalogue &lt;Museum of Anthropology&gt; / X Farm</h2>
							<div className="row">
								<div className="col">Row 2 Col 1</div>
								<div className="col">Row 2 Col 2</div>
							</div>
							<div className="row">
								<div className="col">Row 3 Col 1</div>
								<div className="col">Row 3 Col 2</div>
								<div className="col">Row 3 Col 3</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default App;
