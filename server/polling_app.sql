-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,       -- ✅ Unique ID for each user
  name VARCHAR(100) NOT NULL,             -- ✅ Full name of the user
  email VARCHAR(100) UNIQUE NOT NULL,     -- ✅ Email (must be unique)
  password VARCHAR(255) NOT NULL,         -- ✅ Encrypted password
  role VARCHAR(20) DEFAULT 'user',        -- ✅ Role: user/admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- ✅ Registration time
);


-- POLLS TABLE
CREATE TABLE IF NOT EXISTS polls (
  id INT AUTO_INCREMENT PRIMARY KEY,           -- ✅ Unique poll ID
  question VARCHAR(255) NOT NULL,             -- ✅ The poll question
  created_by INT NOT NULL,                     -- ✅ User ID who created the poll
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- ✅ Time of creation
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE  -- ✅ Link poll to user
);



-- OPTIONS TABLE
CREATE TABLE IF NOT EXISTS options (
  id INT AUTO_INCREMENT PRIMARY KEY,   -- ✅ Unique option ID
  poll_id INT NOT NULL,                -- ✅ Which poll this option belongs to
  option_text VARCHAR(255) NOT NULL,   -- ✅ Text of the option
  votes_count INT DEFAULT 0,           -- ✅ Number of votes for this option
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE  -- ✅ Link option to poll
);


-- VOTES TABLE
CREATE TABLE IF NOT EXISTS votes (
  id INT AUTO_INCREMENT PRIMARY KEY,   -- ✅ Unique vote ID
  poll_id INT NOT NULL,                -- ✅ Poll for which vote is made
  user_id INT NOT NULL,                -- ✅ User who voted
  option_id INT NOT NULL,              -- ✅ Option the user selected
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- ✅ Time of vote
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,  -- ✅ Link to poll
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,  -- ✅ Link to user
  FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE, -- ✅ Link to option
  UNIQUE KEY unique_vote (poll_id, user_id)  -- ✅ Prevents user from voting twice in same poll
);