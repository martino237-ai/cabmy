import { useState, useEffect } from 'react';

interface Reaction {
  publicationId: string;
  type: 'like' | 'dislike';
  count: number;
  userReaction?: 'like' | 'dislike' | null;
}

interface Comment {
  id: string;
  publicationId: string;
  author: string;
  content: string;
  createdAt: string;
}

const REACTIONS_KEY = 'publication_reactions';
const COMMENTS_KEY = 'publication_comments';

export const useReactions = () => {
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [visitorId] = useState(() => {
    let id = localStorage.getItem('visitor_id');
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', id);
    }
    return id;
  });

  // Charger les données au démarrage
  useEffect(() => {
    const storedReactions = localStorage.getItem(REACTIONS_KEY);
    const storedComments = localStorage.getItem(COMMENTS_KEY);
    
    if (storedReactions) {
      setReactions(JSON.parse(storedReactions));
    }
    
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  // Sauvegarder les réactions
  const saveReactions = (newReactions: Record<string, Reaction>) => {
    setReactions(newReactions);
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(newReactions));
  };

  // Sauvegarder les commentaires
  const saveComments = (newComments: Record<string, Comment[]>) => {
    setComments(newComments);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(newComments));
  };

  // Toggle réaction (like/dislike)
  const toggleReaction = (publicationId: string, type: 'like' | 'dislike') => {
    const currentReaction = reactions[publicationId];
    const userReactionKey = `${publicationId}_${visitorId}`;
    const userReactions = JSON.parse(localStorage.getItem('user_reactions') || '{}');
    const currentUserReaction = userReactions[userReactionKey];

    let newReaction: Reaction;

    if (!currentReaction) {
      // Première réaction pour cette publication
      newReaction = {
        publicationId,
        type,
        count: 1,
        userReaction: type
      };
    } else {
      // Réaction existante
      if (currentUserReaction === type) {
        // Annuler la même réaction
        newReaction = {
          ...currentReaction,
          count: Math.max(0, currentReaction.count - 1),
          userReaction: null
        };
        delete userReactions[userReactionKey];
      } else if (currentUserReaction && currentUserReaction !== type) {
        // Changer de like vers dislike ou vice versa
        newReaction = {
          ...currentReaction,
          type,
          userReaction: type
        };
        userReactions[userReactionKey] = type;
      } else {
        // Nouvelle réaction
        newReaction = {
          ...currentReaction,
          count: currentReaction.count + 1,
          userReaction: type
        };
        userReactions[userReactionKey] = type;
      }
    }

    const newReactions = { ...reactions, [publicationId]: newReaction };
    saveReactions(newReactions);
    localStorage.setItem('user_reactions', JSON.stringify(userReactions));
  };

  // Ajouter un commentaire
  const addComment = (publicationId: string, author: string, content: string) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      publicationId,
      author: author.trim() || 'Anonyme',
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const publicationComments = comments[publicationId] || [];
    const newComments = {
      ...comments,
      [publicationId]: [newComment, ...publicationComments]
    };

    saveComments(newComments);
    return newComment;
  };

  // Obtenir les réactions pour une publication
  const getReactionForPublication = (publicationId: string): Reaction => {
    const userReactions = JSON.parse(localStorage.getItem('user_reactions') || '{}');
    const userReactionKey = `${publicationId}_${visitorId}`;
    const userReaction = userReactions[userReactionKey];

    return reactions[publicationId] || {
      publicationId,
      type: 'like',
      count: 0,
      userReaction
    };
  };

  // Obtenir les commentaires pour une publication
  const getCommentsForPublication = (publicationId: string): Comment[] => {
    return comments[publicationId] || [];
  };

  return {
    toggleReaction,
    addComment,
    getReactionForPublication,
    getCommentsForPublication,
    visitorId
  };
};