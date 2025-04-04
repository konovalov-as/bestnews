import { useState, useEffect } from 'react';
import {
  INews,
  NewsFormState,
  AddNewsHandler,
  EditNewsHandler
} from './NewsInterface'
import { TextField } from './TextField'
import { TextAreaField } from './TextAreaField'
import './News.scss'

interface NewsFormProps {
  onSubmit: AddNewsHandler | EditNewsHandler;
  onCancel: () => void;
  initialData?: INews | null;
  isEditing?: boolean;
}

const NewsForm = ({
                    onSubmit,
                    onCancel,
                    initialData,
                    isEditing,
                  }: NewsFormProps) => {
  const [formData, setFormData] = useState<NewsFormState>({
    title: '',
    content: '',
    publishDate: new Date().toLocaleDateString('ru-RU'),
  });
  const [errors, setErrors] = useState({
    title: '',
    content: '',
  });
  const [touched, setTouched] = useState({
    title: false,
    content: false,
    publishDate: false,
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const validateField = (name: keyof NewsFormState, value: string) => {
    if (!value.trim()) {
      return 'Это поле обязательно для заполнения';
    }
    return '';
  };

  const handleBlur = (field: keyof NewsFormState) => {
    setTouched({ ...touched, [field]: true });
    setErrors({
      ...errors,
      [field]: validateField(field, formData[field])
    });
  };

  const handleChange = (field: keyof NewsFormState, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      setErrors({
        ...errors,
        [field]: validateField(field, value)
      });
    }
  };

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    const newTouched = {
      title: true,
      content: true,
      publishDate: true,
    };
    setTouched(newTouched);

    const newErrors = {
      title: validateField('title', formData.title),
      content: validateField('content', formData.content)
    };
    setErrors(newErrors);


    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    if (isEditing) {
      if (!initialData) {
        return;
      }
      (onSubmit as EditNewsHandler)({ ...formData, id: initialData.id });
    } else {
      (onSubmit as AddNewsHandler)(formData);
    }
  };

  return (
    <form className="news__form" onSubmit={handleSubmit}>
      <TextField
        label="Заголовок новости"
        value={formData.title}
        onChange={(evt) => handleChange('title', evt.target.value)}
        onBlur={() => handleBlur('title')}
        error={errors.title}
        required
        fullWidth
        touched={touched.title}
      />

      <TextAreaField
        label="Содержание новости"
        value={formData.content}
        onChange={(evt) => handleChange('content', evt.target.value)}
        onBlur={() => handleBlur('content')}
        error={errors.content}
        required
        fullWidth
        rows={4}
        touched={touched.content}
      />

      <div className="news__form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="submit-button">
          {isEditing ? 'Обновить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};

export default NewsForm;