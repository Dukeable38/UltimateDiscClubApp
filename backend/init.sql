CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  student_number VARCHAR(50) UNIQUE NOT NULL,
  payment VARCHAR(20) CHECK (payment IN ('Weekly', 'Semester')),
  class VARCHAR(20) CHECK (class IN ('Novice', 'Experienced', 'Pro')) DEFAULT 3,
  skill INTEGER CHECK (skill >= 1 AND skill <= 10),
  gender VARCHAR(20),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  skill INTEGER NOT NULL DEFAULT 3,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Sessions table
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed'))
);

-- Check-ins table
CREATE TABLE check_ins (
    check_in_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES sessions(session_id),
    player_id INTEGER NOT NULL REFERENCES players(id),
    is_training BOOLEAN DEFAULT FALSE,
    shirt_color VARCHAR(10) CHECK (shirt_color IN ('black', 'white', 'both')),
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (session_id, player_id)
);


CREATE TABLE draft_assignments (
    draft_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES sessions(session_id),
    player_id INTEGER NOT NULL REFERENCES players(id),
    team VARCHAR(10) NOT NULL CHECK (team IN ('black', 'white')),
    UNIQUE (session_id, player_id)
);