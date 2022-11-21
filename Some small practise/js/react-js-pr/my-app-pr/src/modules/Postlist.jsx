import React from "react";
import PostSolo from "./PostSolo";

const Postlist = ({ post, title }) => {



	return (
		<div>
			<div className="posts">
				{post.post.map(el => {
					
				})}
				<PostSolo title={post.post.map(el =>
					<PostSolo post={el} key={el.id} />)} />
			</div>
		</div>
	)
}

export default Postlist