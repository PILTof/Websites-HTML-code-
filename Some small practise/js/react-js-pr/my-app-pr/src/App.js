import { useState } from 'react';
import './App.css';
import PostSolo from './modules/PostSolo';
import Postlist from './modules/Postlist';

function App() {

	const [post, setPosts] = useState([
		{ id: 1, title: 'Iphone', desc: 'Here desc of the all post. We are created that shit or else and do nothign' },
		{ id: 2, title: 'Shitti', desc: "Desc of twos focking post" }
	]);

	return (
		<div className="App">
			<div className="container">
				<div className="post-wrapp">
					<Postlist post={post}></Postlist>
				</div>
			</div>
		</div>
	);
}

export default App;
