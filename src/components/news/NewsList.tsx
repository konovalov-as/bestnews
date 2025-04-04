import { useState, useEffect } from 'react'
import { getUniqueId } from '../../utils/utils'
import { INews, NewsFormState } from './NewsInterface'
import NewsForm from './NewsForm'
import './News.scss'
import {KEY_NEWS} from '../../utils/const';

const NewsList = () => {
  const [news, setNews] = useState<INews[]>([]);
  const [editingNews, setEditingNews] = useState<INews | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 3000) + 1000));

      try {
        const savedNews: string | null = localStorage.getItem(KEY_NEWS);
        if (savedNews) {
          setNews(JSON.parse(savedNews));
          setIsLoading(false);
          return;
        }

        const response = await fetch('news.json');
        const initialNews: INews[] = await response.json();
        setNews(initialNews);
        localStorage.setItem(KEY_NEWS, JSON.stringify(initialNews));
      } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem(KEY_NEWS, JSON.stringify(news));
    }
  }, [news]);

  const handleExport = () => {
    const dataStr: string = JSON.stringify(news, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url: string = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `news_${new Date().toISOString().slice(0,10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleAdd = (newsItem: NewsFormState) => {
    const newNews = {
      ...newsItem,
      id: getUniqueId(),
      publishDate: new Date().toISOString()
    };
    setNews([newNews, ...news]);
    setShowForm(false);
  };

  const handleEdit = (updatedNews: INews) => {
    setNews(news.map(item => item.id === updatedNews.id ? updatedNews : item));
    setEditingNews(null);
  };

  const handleDelete = (id: string) => {
    setNews(news.filter(item => item.id !== id));
  };

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="news">
      <h1>Новости</h1>

      <div className="controls">
        <button type="button" className="btn btn--add" onClick={() => setShowForm(true)}>
          Добавить новость
        </button>
        <button type="button" className="btn btn--export" onClick={handleExport}>
          Экспорт в JSON
        </button>
        <button type="button" className="btn btn--import" onClick={() => window.location.reload()}>
          Обновить из API
        </button>
      </div>

      {(showForm || editingNews) && (
        <NewsForm
          onSubmit={editingNews ? handleEdit : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setEditingNews(null);
          }}
          initialData={editingNews}
          isEditing={!!editingNews}
        />
      )}

      {!news.length && (
        <div>
          <p>Новостей нет</p>
        </div>
      )}

      {!!news.length && (
        <ul className="news__list">
          {news.map(item => (
            <li
              key={getUniqueId()}
              className="news__item"
            >
              <div className="news__header">
                <h3>{item.title}</h3>
                <div className="news__meta">
                <span className="news__date">
                  {new Date(item.publishDate).toLocaleDateString('ru-RU')}
                </span>
                  <div className="news__actions">
                    <button
                      type="button"
                      aria-label="Редактировать новость"
                      onClick={() => setEditingNews(item)}>✏️
                    </button>
                    <button
                      type="button"
                      aria-label="Удалить новость"
                      onClick={() => handleDelete(item.id)}>🗑️
                    </button>
                  </div>
                </div>
              </div>
              <p
                className="news__content">{item.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsList;