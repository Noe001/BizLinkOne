import { KnowledgeCard } from "../KnowledgeCard";

export default function KnowledgeCardExample() {
  const handleClick = (knowledgeId: string) => {
    console.log(`Knowledge article ${knowledgeId} clicked`);
  };

  const handleShare = (knowledgeId: string) => {
    console.log(`Sharing knowledge article ${knowledgeId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-6xl">
      <KnowledgeCard
        id="kb-1"
        title="Authentication Implementation Guide"
        excerpt="A comprehensive guide to implementing JWT-based authentication in our application, including best practices for security and user management."
        tags={["authentication", "security", "jwt", "backend"]}
        author={{
          id: "john-doe",
          name: "John Doe",
        }}
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)}
        updatedAt={new Date(Date.now() - 1000 * 60 * 60 * 12)}
        views={142}
        relatedChatId="development"
        onClick={handleClick}
        onShare={handleShare}
      />
      
      <KnowledgeCard
        id="kb-2"
        title="API Documentation Standards"
        excerpt="Guidelines for writing clear and comprehensive API documentation that helps both internal developers and external partners understand our services."
        tags={["documentation", "api", "standards", "guidelines"]}
        author={{
          id: "sarah-wilson",
          name: "Sarah Wilson",
        }}
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)}
        views={89}
        onClick={handleClick}
        onShare={handleShare}
      />
      
      <KnowledgeCard
        id="kb-3"
        title="Deployment Process"
        excerpt="Step-by-step instructions for deploying applications to production, including environment setup, testing procedures, and rollback strategies."
        tags={["deployment", "devops", "production", "ci/cd", "testing"]}
        author={{
          id: "mike-johnson",
          name: "Mike Johnson",
        }}
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)}
        updatedAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)}
        views={234}
        relatedChatId="devops"
        onClick={handleClick}
        onShare={handleShare}
      />
    </div>
  );
}