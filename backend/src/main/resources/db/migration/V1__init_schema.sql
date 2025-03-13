-- Create GIN indexes for full text search on tsvector columns
CREATE INDEX idx_projects_title_tsv ON projects USING GIN(title_tsv);
CREATE INDEX idx_projects_technologies_tsv ON projects USING GIN(technologies_tsv);

-- Create trigger function to update tsvector columns
CREATE OR REPLACE FUNCTION projects_tsvector_update_trigger() RETURNS trigger AS $$
BEGIN
    -- Update title_tsv using English dictionary for full text search
    NEW.title_tsv = to_tsvector('english', NEW.title);
    
    -- Convert technologies array to text and update technologies_tsv
    NEW.technologies_tsv = to_tsvector('english', 
        (SELECT string_agg(technology, ' ') FROM project_technologies 
         WHERE project_id = NEW.id));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for insert and update operations
CREATE TRIGGER projects_tsvector_update
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION projects_tsvector_update_trigger(); 