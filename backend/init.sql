-- Drop tables in reverse dependency order to avoid foreign key violations
DROP TABLE IF EXISTS trophies CASCADE;
DROP TABLE IF EXISTS nominations CASCADE;
DROP TABLE IF EXISTS session_results CASCADE;
DROP TABLE IF EXISTS final_allocations CASCADE;
DROP TABLE IF EXISTS draft_assignments CASCADE;
DROP TABLE IF EXISTS drafts CASCADE;
DROP TABLE IF EXISTS check_ins CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- Create tables

-- Players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('Male','Female')),
    skill INTEGER DEFAULT 3 CHECK (skill >= 1 AND skill <= 9),
    class VARCHAR(20) DEFAULT 'Novice' CHECK (class IN ('Novice', 'Experienced', 'Pro')),
    payment VARCHAR(20) DEFAULT 'Weekly' CHECK (payment IN ('Weekly', 'Semester')),
    is_admin BOOLEAN DEFAULT FALSE,
    player_status VARCHAR(20) DEFAULT 'New' CHECK (player_status IN ('New', 'Processed')),
    CONSTRAINT players_automated_fields CHECK (
        skill IS NOT NULL AND class IS NOT NULL AND payment IS NOT NULL AND is_admin IS NOT NULL AND player_status IS NOT NULL
    )
);

-- Sessions table
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    datetime TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Hidden' CHECK (status IN ('Hidden', 'Upcoming', 'Open', 'Drafting', 'In Play', 'Concluded', 'Completed'))
);

-- Check-ins table
CREATE TABLE check_ins (
    check_in_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    is_training BOOLEAN DEFAULT FALSE,
    shirt_color VARCHAR(20) CHECK (shirt_color IN ('Light', 'Dark', 'Both')),
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_status VARCHAR(20) DEFAULT 'Unpaid' CHECK (paid_status IN ('Unpaid', 'Paid', 'Semesterly')),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Drafts table
CREATE TABLE drafts (
    draft_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- Draft assignments table
CREATE TABLE draft_assignments (
    draft_assignment_id SERIAL PRIMARY KEY,
    draft_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    team VARCHAR(20) CHECK (team IN ('Unallocated', 'Light', 'Dark')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'final')),
    FOREIGN KEY (draft_id) REFERENCES drafts(draft_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Final allocations table
CREATE TABLE final_allocations (
    final_allocation_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    team VARCHAR(20) CHECK (team IN ('Light', 'Dark')),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Session results table
CREATE TABLE session_results (
    session_id INTEGER PRIMARY KEY,
    light_score INTEGER DEFAULT 0,
    dark_score INTEGER DEFAULT 0,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- Nominations table
CREATE TABLE nominations (
    nomination_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    nominated_by INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    type VARCHAR(20) CHECK (type IN ('mvp', 'custom')),
    name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'denied')),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (nominated_by) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Trophies table
CREATE TABLE trophies (
    trophy_id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    name VARCHAR(255),
    type VARCHAR(20) CHECK (type IN ('mvp', 'custom')),
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);