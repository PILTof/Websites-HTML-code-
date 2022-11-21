import React from "react";
import { useState } from 'react';


const PostSolo = (props) => {

	const [like, setlike] = useState(0);

	function increament() {
		setlike(like + 1)
		console.log(like)
	}


	return (
		<div>
			<div className="title">
				<h2>{props.title}</h2>
			</div>
			<p>
				{props.desc}
			</p>
			<div className="likes">
				<button onClick={increament}>Like</button>
				<div className="like-count">{like}</div>
			</div>
		</div>
	)
}

export default PostSolo