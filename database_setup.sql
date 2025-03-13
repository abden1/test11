-- Freelancer Management System Database Setup Script
-- This script will:
-- 1. Create a new database (if it doesn't exist)
-- 2. Create necessary tables with relationships
-- 3. Set up indices and constraints
-- 4. Configure full-text search capabilities

-- Connect to postgres database to create our new database
\c postgres

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE freelancer_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'freelancer_db');

-- Connect to our database
\c freelancer_db

-- Create sequence for ID generation
CREATE SEQUENCE IF NOT EXISTS user_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- Create base_users table (parent table for all users)
CREATE TABLE IF NOT EXISTS base_users (
    id BIGINT PRIMARY KEY DEFAULT nextval('user_id_seq'),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create users table (extends base_users)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY REFERENCES base_users(id) ON DELETE CASCADE,
    created_at TIMESTAMP,
    last_login TIMESTAMP,
    account_status VARCHAR(50)
);

-- Create freelancers table (extends users)
CREATE TABLE IF NOT EXISTS freelancers (
    id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(255) NOT NULL,
    years_of_experience INTEGER,
    hourly_rate DECIMAL(10,2)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    freelancer_id BIGINT REFERENCES freelancers(id) ON DELETE CASCADE,
    title_tsv TSVECTOR,
    technologies_tsv TSVECTOR
);

-- Create project_technologies table for the many-to-many relationship
CREATE TABLE IF NOT EXISTS project_technologies (
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    technology VARCHAR(255),
    PRIMARY KEY (project_id, technology)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON base_users(email);
CREATE INDEX idx_projects_freelancer_id ON projects(freelancer_id);
CREATE INDEX idx_projects_title ON projects(title);

-- Create GIN indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_projects_title_tsv ON projects USING GIN(title_tsv);
CREATE INDEX IF NOT EXISTS idx_projects_technologies_tsv ON projects USING GIN(technologies_tsv);

-- Create trigger function to update tsvector columns
CREATE OR REPLACE FUNCTION projects_tsvector_update_trigger() RETURNS trigger AS $$
BEGIN
    -- Update title_tsv using English dictionary for full text search
    NEW.title_tsv = to_tsvector('english', NEW.title);
    
    -- Convert technologies array to text and update technologies_tsv
    -- This is a bit complex - we need to get the technologies for this project
    NEW.technologies_tsv = to_tsvector('english', 
        (SELECT string_agg(technology, ' ') FROM project_technologies 
         WHERE project_id = NEW.id));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for insert and update operations
DROP TRIGGER IF EXISTS projects_tsvector_update ON projects;
CREATE TRIGGER projects_tsvector_update
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION projects_tsvector_update_trigger();

-- Insert initial data for testing (optional)
-- Uncomment if you want sample data

/*
-- Insert a test user
INSERT INTO base_users (name, email, password) 
VALUES ('Test User', 'test@example.com', 'password123');

-- Make it a regular user
INSERT INTO users (id, created_at, account_status) 
VALUES (currval('user_id_seq'), CURRENT_TIMESTAMP, 'ACTIVE');

-- Make it a freelancer
INSERT INTO freelancers (id, specialization, years_of_experience, hourly_rate) 
VALUES (currval('user_id_seq'), 'Web Development', 5, 35.00);

-- Add a project
INSERT INTO projects (title, description, created_at, freelancer_id) 
VALUES ('E-commerce Website', 'A full-featured online store with product listings and payment processing', CURRENT_TIMESTAMP, currval('user_id_seq'));

-- Add technologies for the project
INSERT INTO project_technologies (project_id, technology) 
VALUES 
(currval('pg_class.reltuples'), 'React'),
(currval('pg_class.reltuples'), 'Node.js'),
(currval('pg_class.reltuples'), 'PostgreSQL');
*/

-- Instructions for updating the password for the postgres user:
/*
To reset the PostgreSQL password:

1. Use psql as a superuser:
   psql -U postgres

2. Set the password:
   ALTER USER postgres WITH PASSWORD 'your_new_password';

3. Then update the application.properties file with the new password
*/

-- END OF SCRIPT 