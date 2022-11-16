import './App.css';
import './styles/app.css'
import { useState } from 'react';
import PostList from './components/PostList';
import MyButton from './components/UI/button/MyButton';
import MyInput from './components/UI/input/MyInput';


const App = () => {
	const [posts, setPosts] = useState([
		{ id: 1, title: 'JavaScript', body: 'Description' },
		{ id: 2, title: 'JavaScript 2', body: 'Description' },
		{ id: 3, title: 'JavaScript 3', body: 'Description' }
	])

	const [title, setTitle] = useState('');

	const addNewPost = (e) => {
		e.preventDefault();
		console.log(title)
	}


	return (
		<div className='App'>
			<form>
				<MyInput
					value={title}
					onChange={e => setTitle(e.target.value)}
					type="text" placeholder='Названия поста' />
				<MyInput type="text" placeholder='Описание поста' />
				<MyButton onClick={addNewPost}>Создать пост</MyButton>
			</form>
			<PostList posts={posts} title="Список постов JS" />

		</div>
	)
}



export default App;
