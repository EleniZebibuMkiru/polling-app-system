-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,       
  name VARCHAR(100) NOT NULL,             
  email VARCHAR(100) UNIQUE NOT NULL,     
  password VARCHAR(255) NOT NULL,         
  role VARCHAR(20) DEFAULT 'user',       
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);


-- POLLS TABLE
CREATE TABLE IF NOT EXISTS polls (
  id INT AUTO_INCREMENT PRIMARY KEY,           
  question VARCHAR(255) NOT NULL,            
  created_by INT NOT NULL,                     
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE  --  Link poll to user
);



-- OPTIONS TABLE
CREATE TABLE IF NOT EXISTS options (
  id INT AUTO_INCREMENT PRIMARY KEY,  
  poll_id INT NOT NULL,                
  option_text VARCHAR(255) NOT NULL,  
  votes_count INT DEFAULT 0,           
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE  --  Link option to poll
);


-- VOTES TABLE
CREATE TABLE IF NOT EXISTS votes (
  id INT AUTO_INCREMENT PRIMARY KEY,  
  poll_id INT NOT NULL,                
  user_id INT NOT NULL,                
  option_id INT NOT NULL,              
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,  
  FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE, 
  UNIQUE KEY unique_vote (poll_id, user_id)  --  Prevents user from voting twice in same poll
);