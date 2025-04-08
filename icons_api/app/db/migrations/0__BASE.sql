-- Version: 0
-- Date: 2025-03-21
-- BASE

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION if NOT EXISTS pg_trgm;
SET TIMEZONE='UTC';

-- bool(1 & 1 << 0) = true
CREATE OR REPLACE FUNCTION has_flag(mask INT, flag INT) RETURNS BOOLEAN AS $$
BEGIN
    RETURN (mask & flag) = flag;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION set_flag(mask INT, flag INT) RETURNS INT AS $$
BEGIN
    RETURN mask | flag;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TABLE IF NOT EXISTS schema (
    version INT NOT NULL PRIMARY KEY,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    flags INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temp_banned_until TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

CREATE TABLE IF NOT EXISTS user_settings (
    id VARCHAR(36) NOT NULL PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- Microsoft OAuth2 authorization
CREATE TABLE IF NOT EXISTS bearers (
    email VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE REFERENCES users(email) ON DELETE CASCADE,
    id_token TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- First party authorization
CREATE TABLE IF NOT EXISTS tokens (
    token VARCHAR(255) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS tokens_email_idx ON tokens (email);

-- Dynamic
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    year_level INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS courses_code_idx ON courses (code);
CREATE INDEX IF NOT EXISTS courses_name_idx ON courses (name);
CREATE INDEX IF NOT EXISTS courses_year_level_idx ON courses (year_level);
CREATE INDEX IF NOT EXISTS courses_category_idx ON courses (category);

CREATE TABLE IF NOT EXISTS tags (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    color INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS tags_name_idx ON tags (name);

-- Resources
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id VARCHAR(36) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    type INT NOT NULL, -- ENUM
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    author_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    uri TEXT NOT NULL, -- URL or S3 resource
    pending BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS trgm_idx_title ON resources USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS trgm_idx_description ON resources USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS resources_course_id_idx ON resources (course_id);

CREATE TABLE IF NOT EXISTS resource_tags (
    resource_id VARCHAR(36) NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    tag_id VARCHAR(36) NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, tag_id)
);
CREATE INDEX IF NOT EXISTS resource_tags_resource_id_idx ON resource_tags (resource_id);
CREATE INDEX IF NOT EXISTS resource_tags_tag_id_idx ON resource_tags (tag_id);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event VARCHAR(255) NOT NULL,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    reference_id VARCHAR(36),
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB
);
CREATE INDEX IF NOT EXISTS analytics_user_id_idx ON analytics (user_id);
CREATE INDEX IF NOT EXISTS analytics_reference_id_idx ON analytics (reference_id);
