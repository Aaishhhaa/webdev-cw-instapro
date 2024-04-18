import { USER_POSTS_PAGE } from '../routes.js';
import { renderHeaderComponent } from './header-component.js';
import { posts, goToPage } from '../index.js';
import { formatDistanceToNow } from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/index.js';
import { like } from '../api.js';
import { getToken, user } from '../index.js';
import { setLike } from '../helpers.js';

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log('Актуальный список постов:', posts);
    function sanitizeHtml(str) {
        return str
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('/', '&sol;')
    }
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
               
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                 ${posts
                   .map((el) => {
                       function sanitizeHtml(str) {
                           return str
                               .replace('&', '&amp;')
                               .replace('<', '&lt;')
                               .replace('>', '&gt;')
                               .replace('/', '&sol;')
                       }
                     return `
                  <li class="post">
                    <div class="post-header" data-user-id="${el.user.id}">
                        <img src="${
                          el.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${sanitizeHtml(el.user.name)}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${el.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-is-liked="${el.isLiked}" data-post-id="${
                       el.id
                     }" class="like-button">
                        <img src="./assets/images/${
                          el.isLiked ? `like-active.svg` : `like-not-active.svg`
                        }">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${el.likes.length}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${sanitizeHtml(el.user.name)}</span>
                      ${sanitizeHtml(el.description)}
                    </p>
                    <p class="post-date">
                      ${formatDistanceToNow(new Date(el.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </li>
                  `;
                   })
                   .join('')}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector('.header-container'),
  });

  for (let userEl of document.querySelectorAll('.post-header')) {
    userEl.addEventListener('click', () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let postLikes of document.querySelectorAll('.post-likes')) {
    const likeButton = postLikes.querySelector('.like-button');
    const postLikesText = postLikes.querySelector('strong');
    const postId = likeButton.dataset.postId;

    likeButton.addEventListener('click', () => {
      setLike({
        like,
        likeButton,
        postLikesText,
        postId,
        token: getToken(),
        user,
      });
    });
  }
}
