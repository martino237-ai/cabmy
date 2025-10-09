import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send, User } from "lucide-react";
import { useReactions } from "@/hooks/useReactions";
import { toast } from "sonner";

interface PublicationInteractionsProps {
  publicationId: string;
}

const PublicationInteractions = ({ publicationId }: PublicationInteractionsProps) => {
  const { toggleReaction, addComment, getReactionForPublication, getCommentsForPublication } = useReactions();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState(() => {
    return localStorage.getItem('comment_author') || '';
  });

  const reaction = getReactionForPublication(publicationId);
  const comments = getCommentsForPublication(publicationId);
  const isLiked = reaction.userReaction === 'like';

  const handleLike = () => {
    toggleReaction(publicationId, 'like');
  };

  const handleComment = () => {
    if (!newComment.trim()) {
      toast.error('Veuillez saisir un commentaire');
      return;
    }

    const finalAuthor = commentAuthor.trim() || 'Anonyme';
    localStorage.setItem('comment_author', finalAuthor);
    
    addComment(publicationId, finalAuthor, newComment);
    setNewComment('');
    toast.success('Commentaire ajouté !');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border-t border-border pt-4 space-y-4">
      {/* Boutons d'interaction */}
      <div className="flex items-center gap-4">
        <Button
          variant={isLiked ? "default" : "ghost"}
          size="sm"
          onClick={handleLike}
          className={`flex items-center gap-2 transition-smooth ${
            isLiked ? 'text-primary-foreground' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          {reaction.count > 0 ? reaction.count : 'J\'aime'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
        >
          <MessageCircle className="w-4 h-4" />
          {comments.length > 0 ? `${comments.length} commentaire${comments.length > 1 ? 's' : ''}` : 'Commenter'}
        </Button>
      </div>

      {/* Section commentaires */}
      {showComments && (
        <Card className="bg-accent/50">
          <CardContent className="p-4 space-y-4">
            {/* Formulaire nouveau commentaire */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Votre nom (optionnel)"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="pl-10"
                    maxLength={50}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Écrivez votre commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none"
                  rows={2}
                  maxLength={500}
                />
                <Button
                  onClick={handleComment}
                  size="sm"
                  className="self-end"
                  disabled={!newComment.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {newComment.length}/500 caractères
              </div>
            </div>

            {/* Liste des commentaires */}
            {comments.length > 0 && (
              <div className="space-y-3 border-t border-border pt-4">
                <h4 className="font-medium text-sm text-primary">
                  Commentaires ({comments.length})
                </h4>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-background rounded-lg p-3 border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-primary">
                          {comment.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PublicationInteractions;