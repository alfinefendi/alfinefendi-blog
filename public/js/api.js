document.addEventListener('DOMContentLoaded', function () {
  const host = `http://127.0.0.1:3000/api/article`;
  const getPosts = async () => {
    try {
      const url = `${host}/posts`;
      const response = await fetch(`${url}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const posts = await response.json();
      renderPosts(posts);
    } catch (error) {

    }
  }

  function renderPosts(posts) {
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';
    for (let post of posts) {
      let date = new Date(post.created_at);
      let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      let actual_date = date.toLocaleDateString(undefined, options);
      let content = `
                    <li>
                      <span class="post-meta">${actual_date}</span>
                      <h3>
                        <a class="post-link" href="#" data-id="${post._id}">
                          ${post.title ?? ''}
                        </a>
                      </h3>
                    </li>
                `;
      postList.innerHTML += content;
    }

    const links = document.querySelectorAll('.post-link');
    for (let link of links) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const postId = this.getAttribute('data-id');
        const post = posts.find(p => p._id === postId);
        renderPost(post);
      });
    }
  }

  function renderPost(post) {
    const postList = document.getElementById('post-list');
    if (postList === null) {
      console.error('Element with ID "post-list" not found.');
      return;
    }
    let date = new Date(post.created_at);
    let options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    let actual_date = date.toLocaleDateString(undefined, options);
    postList.innerHTML = `
        <li>
          <span class="post-meta">${actual_date}</span>
          <h3>
            <a class="post-link" href="#" data-id="${post._id}">
              ${post.title}
            </a>
            <p>${post.body}</p>
          </h3>
          <div>
            <button id="edit-${post._id}">Edit</button>
            <button id="delete-${post._id}">Delete</button>
          </div>
        </li>
      `;
    // Add event listener for the update button
    document.getElementById(`delete-${post._id}`).addEventListener('click', () => {
      deletePost(post._id);
    });

    document.getElementById(`edit-${post._id}`).addEventListener('click', () => {
      editPost({
        '_id': post._id,
        'title': post.title,
        'body': post.body
      });
    });
  }

  getPosts();

  // delete
  async function deletePost(id) {
    try {
      const url = `${host}/post/${id}`;
      const response = await fetch(`${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        alert('Post deleted successfully')
        getPosts();
      } else {
        console.error('Post failed to delete');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // edit
  function editPost(post) {
    const postList = document.getElementById('post-list');
    postList.innerHTML = `

        <form id="post-form">
          <input type="text" id="edit-title" value="${post.title}" placeholder="Title" required><br><br>
          <input id="edit-body" type="hidden" value="${post.body}">
          <trix-editor input="edit-body"></trix-editor>
          <button hidden id="update-btn">submit</button>
      </form>
      
      `;
    setInterval(() => initListener(
      {
        '_id': post._id,
        'title': post.title,
        'body': post.body
      }
    ), 1000);
  }


  function initListener(post) {
    let title = document.getElementById(`edit-title`).value;
    let bodyTrix = document.getElementById(`edit-body`).value;
    let body = bodyTrix.replace(/<[^>]*>/g, '');
    if (body != post.body || title != post.title) {
      let updateButton = document.getElementById('update-btn');
      updateButton.removeAttribute('hidden');
      updateButton.addEventListener('click', (e) => {
        e.preventDefault();
        setTimeout(() => {
          updateButton.removeEventListener('click', updatePost(
            {
              '_id': post._id,
              'title': title,
              'body': body
            }
          )
          );
        }, 500);

      });
    }
  }

  const updatePost = async (newPost) => {
    try {
      const url = `${host}/post/${newPost._id}`
      const res = await fetch(`${url}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: {
            'title': newPost.title,
            'body': newPost.body
          }
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Post updated successfully');
        getPosts(); // Refresh data after update
      } else {
        console.error('Error updating post:', data.errors);
        alert('Failed to update post: ' + data.errors.join(', '));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the post.');
    }
  };

  // create
  document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    let title = document.getElementById('title').value;
    let body = document.getElementById('body').value;

    try {
      const res = await fetch(`${host}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
        },
        body: JSON.stringify({
            title: title,
            body: body
        })
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Post created:', data);
        alert('Post created successfully');
        title = '';
        clearTrixEditor();
       
      } else {
        console.error('Error creating post:', data.errors);
        alert('Failed to create post: ' + data.errors.join(', '));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the post.');
    }
  });
  
  
  function clearTrixEditor() {
    let title = document.getElementById('title');
    const editor = document.querySelector("trix-editor").editor;
    // Set the editor's content to an empty string
    title.value = '';
    editor.loadHTML('');
  }
});