-- Seed Curriculum Paths
INSERT INTO curriculum_paths (id, name, description, order_index, icon, color, is_locked, prerequisite_path_id) VALUES
  ('11111111-0001-0001-0001-000000000001', 'Foundations', 'Master the basics: counting, arithmetic, fractions, and more', 1, '🔢', '#FF6B35', false, NULL),
  ('11111111-0001-0001-0001-000000000002', 'Pre-Algebra', 'Variables, equations, and the language of mathematics', 2, '📐', '#4ECDC4', true, '11111111-0001-0001-0001-000000000001'),
  ('11111111-0001-0001-0001-000000000003', 'Algebra I', 'Linear equations, polynomials, and functions', 3, '🔡', '#FFE66D', true, '11111111-0001-0001-0001-000000000002'),
  ('11111111-0001-0001-0001-000000000004', 'Geometry', 'Shapes, proofs, and spatial reasoning', 4, '📏', '#06D6A0', true, '11111111-0001-0001-0001-000000000003'),
  ('11111111-0001-0001-0001-000000000005', 'Algebra II', 'Complex numbers, polynomials, and advanced functions', 5, '📊', '#EF476F', true, '11111111-0001-0001-0001-000000000004'),
  ('11111111-0001-0001-0001-000000000006', 'Trigonometry', 'Angles, waves, and the unit circle', 6, '🌊', '#9B59B6', true, '11111111-0001-0001-0001-000000000005'),
  ('11111111-0001-0001-0001-000000000007', 'Pre-Calculus', 'Limits, vectors, and preparing for calculus', 7, '🚀', '#3498DB', true, '11111111-0001-0001-0001-000000000006'),
  ('11111111-0001-0001-0001-000000000008', 'Calculus I', 'Derivatives, integrals, and the fundamental theorem', 8, '🧮', '#E74C3C', true, '11111111-0001-0001-0001-000000000007'),
  ('11111111-0001-0001-0001-000000000009', 'Calculus II', 'Advanced integration, series, and differential equations', 9, '🌀', '#1ABC9C', true, '11111111-0001-0001-0001-000000000008'),
  ('11111111-0001-0001-0001-000000000010', 'Multivariable Calculus', 'Vectors, partial derivatives, and multiple integrals in 3D', 10, '🗺️', '#F39C12', true, '11111111-0001-0001-0001-000000000009'),
  ('11111111-0001-0001-0001-000000000011', 'Linear Algebra', 'Matrices, vectors, and transformations', 11, '🔷', '#2980B9', true, '11111111-0001-0001-0001-000000000010'),
  ('11111111-0001-0001-0001-000000000012', 'Differential Equations', 'ODEs, PDEs, and Laplace transforms', 12, '⚡', '#8E44AD', true, '11111111-0001-0001-0001-000000000011'),
  ('11111111-0001-0001-0001-000000000013', 'Discrete Mathematics', 'Logic, graphs, combinatorics, and algorithms', 13, '🕸️', '#27AE60', true, '11111111-0001-0001-0001-000000000012'),
  ('11111111-0001-0001-0001-000000000014', 'Number Theory', 'Primes, modular arithmetic, and cryptography', 14, '🔑', '#D35400', true, '11111111-0001-0001-0001-000000000013'),
  ('11111111-0001-0001-0001-000000000015', 'Set Theory', 'Infinity, axioms, and the foundations of math', 15, '🧩', '#C0392B', true, '11111111-0001-0001-0001-000000000014'),
  ('11111111-0001-0001-0001-000000000016', 'Abstract Algebra', 'Groups, rings, fields, and Galois theory', 16, '🏛️', '#7F8C8D', true, '11111111-0001-0001-0001-000000000015'),
  ('11111111-0001-0001-0001-000000000017', 'Real Analysis', 'Rigorous calculus, metric spaces, and measure theory', 17, '📡', '#2C3E50', true, '11111111-0001-0001-0001-000000000016'),
  ('11111111-0001-0001-0001-000000000018', 'Complex Analysis', 'Analytic functions, contour integration, and residues', 18, '✨', '#16A085', true, '11111111-0001-0001-0001-000000000017'),
  ('11111111-0001-0001-0001-000000000019', 'Topology', 'Topological spaces, manifolds, and fundamental groups', 19, '🍩', '#E67E22', true, '11111111-0001-0001-0001-000000000018'),
  ('11111111-0001-0001-0001-000000000020', 'Advanced Topics & Unsolved Problems', 'The frontiers of mathematics: Millennium Prize Problems and beyond', 20, '🏆', '#FFD700', true, '11111111-0001-0001-0001-000000000019');

-- Seed Units for Path 1: Foundations
INSERT INTO units (id, path_id, name, description, order_index, xp_reward, icon) VALUES
  ('22222222-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001', 'Counting & Numbers', 'Learn to count and understand numbers', 1, 50, '🔢'),
  ('22222222-0001-0001-0001-000000000002', '11111111-0001-0001-0001-000000000001', 'Addition & Subtraction', 'Master the fundamentals of adding and subtracting', 2, 50, '➕'),
  ('22222222-0001-0001-0001-000000000003', '11111111-0001-0001-0001-000000000001', 'Multiplication & Division', 'Multiply and divide with confidence', 3, 60, '✖️'),
  ('22222222-0001-0001-0001-000000000004', '11111111-0001-0001-0001-000000000001', 'Fractions & Decimals', 'Understand parts of a whole', 4, 70, '🥧'),
  ('22222222-0001-0001-0001-000000000005', '11111111-0001-0001-0001-000000000001', 'Percentages', 'Work with percentages in everyday math', 5, 60, '💯'),
  ('22222222-0001-0001-0001-000000000006', '11111111-0001-0001-0001-000000000001', 'Negative Numbers', 'Explore numbers below zero', 6, 60, '➖'),
  ('22222222-0001-0001-0001-000000000007', '11111111-0001-0001-0001-000000000001', 'Order of Operations', 'Master BODMAS/PEMDAS', 7, 70, '📋'),
  ('22222222-0001-0001-0001-000000000008', '11111111-0001-0001-0001-000000000001', 'Basic Word Problems', 'Apply math to real-world scenarios', 8, 80, '📝');

-- Seed Units for Path 2: Pre-Algebra
INSERT INTO units (id, path_id, name, description, order_index, xp_reward, icon) VALUES
  ('22222222-0002-0001-0001-000000000001', '11111111-0001-0001-0001-000000000002', 'Variables & Expressions', 'Introduction to algebraic thinking', 1, 60, '🔤'),
  ('22222222-0002-0001-0001-000000000002', '11111111-0001-0001-0001-000000000002', 'Solving Simple Equations', 'Find the unknown', 2, 60, '🔍'),
  ('22222222-0002-0001-0001-000000000003', '11111111-0001-0001-0001-000000000002', 'Inequalities', 'Greater than, less than, and beyond', 3, 60, '⚖️'),
  ('22222222-0002-0001-0001-000000000004', '11111111-0001-0001-0001-000000000002', 'Ratios & Proportions', 'Compare quantities meaningfully', 4, 60, '📊'),
  ('22222222-0002-0001-0001-000000000005', '11111111-0001-0001-0001-000000000002', 'Introduction to Graphs', 'Visualize mathematical relationships', 5, 70, '📈'),
  ('22222222-0002-0001-0001-000000000006', '11111111-0001-0001-0001-000000000002', 'Coordinate Plane Basics', 'Navigate the x-y plane', 6, 70, '🎯'),
  ('22222222-0002-0001-0001-000000000007', '11111111-0001-0001-0001-000000000002', 'Patterns & Sequences', 'Discover mathematical patterns', 7, 70, '🔄');

-- Seed Lessons for Unit 1 (Counting & Numbers)
INSERT INTO lessons (id, unit_id, name, description, order_index, lesson_type, xp_reward, estimated_minutes) VALUES
  ('33333333-0001-0001-0001-000000000001', '22222222-0001-0001-0001-000000000001', 'Welcome to Numbers!', 'Start your math journey with counting', 1, 'tutorial', 10, 3),
  ('33333333-0001-0001-0001-000000000002', '22222222-0001-0001-0001-000000000001', 'Counting Practice', 'Practice counting objects', 2, 'practice', 10, 5),
  ('33333333-0001-0001-0001-000000000003', '22222222-0001-0001-0001-000000000001', 'Number Recognition', 'Identify and name numbers', 3, 'practice', 10, 5),
  ('33333333-0001-0001-0001-000000000004', '22222222-0001-0001-0001-000000000001', 'Comparing Numbers', 'Greater than and less than', 4, 'practice', 15, 5),
  ('33333333-0001-0001-0001-000000000005', '22222222-0001-0001-0001-000000000001', 'Counting Challenge', 'Test your counting skills!', 5, 'boss_round', 25, 5);

-- Seed Lessons for Unit 2 (Addition & Subtraction)
INSERT INTO lessons (id, unit_id, name, description, order_index, lesson_type, xp_reward, estimated_minutes) VALUES
  ('33333333-0002-0001-0001-000000000001', '22222222-0001-0001-0001-000000000002', 'What is Addition?', 'Learn how to add numbers together', 1, 'tutorial', 10, 3),
  ('33333333-0002-0001-0001-000000000002', '22222222-0001-0001-0001-000000000002', 'Addition Practice', 'Practice basic addition', 2, 'practice', 10, 5),
  ('33333333-0002-0001-0001-000000000003', '22222222-0001-0001-0001-000000000002', 'What is Subtraction?', 'Learn how to subtract', 3, 'tutorial', 10, 3),
  ('33333333-0002-0001-0001-000000000004', '22222222-0001-0001-0001-000000000002', 'Subtraction Practice', 'Practice basic subtraction', 4, 'practice', 10, 5),
  ('33333333-0002-0001-0001-000000000005', '22222222-0001-0001-0001-000000000002', 'Add & Subtract Boss', 'Show what you know!', 5, 'boss_round', 25, 5);

-- Seed Lessons for Unit 3 (Multiplication & Division)
INSERT INTO lessons (id, unit_id, name, description, order_index, lesson_type, xp_reward, estimated_minutes) VALUES
  ('33333333-0003-0001-0001-000000000001', '22222222-0001-0001-0001-000000000003', 'Introduction to Multiplication', 'Repeated addition made simple', 1, 'tutorial', 10, 5),
  ('33333333-0003-0001-0001-000000000002', '22222222-0001-0001-0001-000000000003', 'Times Tables', 'Master your multiplication tables', 2, 'practice', 15, 10),
  ('33333333-0003-0001-0001-000000000003', '22222222-0001-0001-0001-000000000003', 'Introduction to Division', 'Sharing equally', 3, 'tutorial', 10, 5),
  ('33333333-0003-0001-0001-000000000004', '22222222-0001-0001-0001-000000000003', 'Division Practice', 'Practice dividing numbers', 4, 'practice', 15, 5),
  ('33333333-0003-0001-0001-000000000005', '22222222-0001-0001-0001-000000000003', 'Multiply & Divide Boss', 'Prove your mastery!', 5, 'boss_round', 25, 5);

-- Seed Questions for Lesson 1 (Welcome to Numbers)
INSERT INTO questions (id, lesson_id, question_type, difficulty, question_text, options, correct_answer, explanation, hint, xp_value, order_index) VALUES
  ('44444444-0001-0001-0001-000000000001', '33333333-0001-0001-0001-000000000001', 'multiple_choice', 'easy', 'How many apples are shown? 🍎🍎🍎', '[{"id":"a","text":"2"},{"id":"b","text":"3"},{"id":"c","text":"4"},{"id":"d","text":"5"}]', '"b"', 'There are 3 apples! Count each one: 1, 2, 3.', 'Try counting each apple one by one', 5, 1),
  ('44444444-0001-0001-0001-000000000002', '33333333-0001-0001-0001-000000000001', 'multiple_choice', 'easy', 'Which number comes after 5?', '[{"id":"a","text":"4"},{"id":"b","text":"5"},{"id":"c","text":"6"},{"id":"d","text":"7"}]', '"c"', 'The number after 5 is 6! When we count: 1, 2, 3, 4, 5, 6...', 'Count from 1 and listen for what comes after 5', 5, 2),
  ('44444444-0001-0001-0001-000000000003', '33333333-0001-0001-0001-000000000001', 'fill_in_blank', 'easy', 'Fill in the missing number: 1, 2, ___, 4, 5', NULL, '"3"', 'The missing number is 3! The sequence goes 1, 2, 3, 4, 5.', 'What number comes between 2 and 4?', 5, 3),
  ('44444444-0001-0001-0001-000000000004', '33333333-0001-0001-0001-000000000001', 'true_false', 'easy', 'True or False: 7 is greater than 9', '[{"id":"true","text":"True"},{"id":"false","text":"False"}]', '"false"', '7 is less than 9, not greater. On a number line, 7 comes before 9.', 'Think about which number is bigger', 5, 4),
  ('44444444-0001-0001-0001-000000000005', '33333333-0001-0001-0001-000000000001', 'multiple_choice', 'easy', 'How many stars? ⭐⭐⭐⭐⭐', '[{"id":"a","text":"3"},{"id":"b","text":"4"},{"id":"c","text":"5"},{"id":"d","text":"6"}]', '"c"', 'There are 5 stars! Great counting!', 'Count each star carefully', 5, 5);

-- Seed Questions for Lesson 2 (Counting Practice)
INSERT INTO questions (id, lesson_id, question_type, difficulty, question_text, options, correct_answer, explanation, hint, xp_value, order_index) VALUES
  ('44444444-0002-0001-0001-000000000001', '33333333-0001-0001-0001-000000000002', 'multiple_choice', 'easy', 'Count the circles: ⚫⚫⚫⚫⚫⚫', '[{"id":"a","text":"5"},{"id":"b","text":"6"},{"id":"c","text":"7"},{"id":"d","text":"8"}]', '"b"', 'There are 6 circles!', 'Count slowly, one by one', 5, 1),
  ('44444444-0002-0001-0001-000000000002', '33333333-0001-0001-0001-000000000002', 'fill_in_blank', 'easy', 'What number comes before 10?', NULL, '"9"', 'The number before 10 is 9!', 'Count up: ...7, 8, ?, 10', 5, 2),
  ('44444444-0002-0001-0001-000000000003', '33333333-0001-0001-0001-000000000002', 'multiple_choice', 'easy', 'Which is the largest number?', '[{"id":"a","text":"3"},{"id":"b","text":"8"},{"id":"c","text":"5"},{"id":"d","text":"1"}]', '"b"', '8 is the largest! It is further right on the number line.', 'Which number would you reach last when counting from 1?', 5, 3),
  ('44444444-0002-0001-0001-000000000004', '33333333-0001-0001-0001-000000000002', 'fill_in_blank', 'easy', 'Count by 2s: 2, 4, 6, ___', NULL, '"8"', 'When counting by 2s: 2, 4, 6, 8, 10...', 'Add 2 to the last number', 5, 4),
  ('44444444-0002-0001-0001-000000000005', '33333333-0001-0001-0001-000000000002', 'true_false', 'easy', 'True or False: 10 is the biggest one-digit number', '[{"id":"true","text":"True"},{"id":"false","text":"False"}]', '"false"', '10 has two digits! The biggest one-digit number is 9.', 'How many digits does 10 have?', 5, 5);

-- Seed Questions for Addition lesson
INSERT INTO questions (id, lesson_id, question_type, difficulty, question_text, question_latex, options, correct_answer, explanation, hint, xp_value, order_index) VALUES
  ('44444444-0003-0001-0001-000000000001', '33333333-0002-0001-0001-000000000001', 'multiple_choice', 'easy', 'What is 2 + 3?', '2 + 3 = ?', '[{"id":"a","text":"4"},{"id":"b","text":"5"},{"id":"c","text":"6"},{"id":"d","text":"7"}]', '"b"', '2 + 3 = 5! If you have 2 apples and get 3 more, you have 5 apples.', 'Count 2, then count 3 more', 5, 1),
  ('44444444-0003-0001-0001-000000000002', '33333333-0002-0001-0001-000000000001', 'fill_in_blank', 'easy', 'What is 4 + 1?', '4 + 1 = ?', NULL, '"5"', '4 + 1 = 5! Adding 1 means going to the next number.', 'What comes right after 4?', 5, 2),
  ('44444444-0003-0001-0001-000000000003', '33333333-0002-0001-0001-000000000001', 'multiple_choice', 'easy', 'What is 3 + 3?', '3 + 3 = ?', '[{"id":"a","text":"5"},{"id":"b","text":"6"},{"id":"c","text":"7"},{"id":"d","text":"9"}]', '"b"', '3 + 3 = 6! Two groups of 3 make 6.', 'Hold up 3 fingers on each hand', 5, 3),
  ('44444444-0003-0001-0001-000000000004', '33333333-0002-0001-0001-000000000001', 'equation_solver', 'easy', 'Solve: 5 + 2 = ?', '5 + 2 = ?', NULL, '"7"', '5 + 2 = 7! Start at 5 and count 2 more: 6, 7.', 'Start at 5 and count up 2', 5, 4),
  ('44444444-0003-0001-0001-000000000005', '33333333-0002-0001-0001-000000000001', 'multiple_choice', 'easy', 'What is 1 + 1?', '1 + 1 = ?', '[{"id":"a","text":"1"},{"id":"b","text":"2"},{"id":"c","text":"3"},{"id":"d","text":"0"}]', '"b"', '1 + 1 = 2! The simplest addition!', 'If you have one cookie and get one more...', 5, 5);

-- Seed Achievements
INSERT INTO achievements (name, description, icon, xp_reward, condition_type, condition_value, rarity) VALUES
  ('First Steps', 'Complete your first lesson', '👶', 10, 'lessons_completed', 1, 'common'),
  ('Getting Started', 'Complete 5 lessons', '🚶', 25, 'lessons_completed', 5, 'common'),
  ('On a Roll', 'Complete 25 lessons', '🏃', 50, 'lessons_completed', 25, 'common'),
  ('Century Club', 'Complete 100 lessons', '💯', 100, 'lessons_completed', 100, 'rare'),
  ('Streak Starter', 'Achieve a 3-day streak', '🔥', 15, 'streak_days', 3, 'common'),
  ('Week Warrior', 'Achieve a 7-day streak', '⚡', 30, 'streak_days', 7, 'common'),
  ('Monthly Master', 'Achieve a 30-day streak', '🌟', 100, 'streak_days', 30, 'rare'),
  ('Streak Legend', 'Achieve a 100-day streak', '👑', 500, 'streak_days', 100, 'epic'),
  ('Year of Math', 'Achieve a 365-day streak', '🏆', 2000, 'streak_days', 365, 'legendary'),
  ('XP Hunter', 'Earn 1,000 XP', '⭐', 25, 'total_xp', 1000, 'common'),
  ('XP Master', 'Earn 10,000 XP', '🌠', 100, 'total_xp', 10000, 'rare'),
  ('XP Legend', 'Earn 100,000 XP', '💫', 500, 'total_xp', 100000, 'epic'),
  ('Perfect Score', 'Get 100% on a lesson', '🎯', 20, 'perfect_lessons', 1, 'common'),
  ('Perfectionist', 'Get 100% on 10 lessons', '💎', 100, 'perfect_lessons', 10, 'rare'),
  ('Path Pioneer', 'Complete your first path', '🗺️', 200, 'paths_completed', 1, 'rare'),
  ('Path Master', 'Complete 5 paths', '🏔️', 500, 'paths_completed', 5, 'epic'),
  ('Math Olympian', 'Complete 10 paths', '🥇', 1000, 'paths_completed', 10, 'epic'),
  ('Infinity Achiever', 'Complete all 20 paths', '♾️', 5000, 'paths_completed', 20, 'legendary'),
  ('Social Butterfly', 'Add 5 friends', '🦋', 25, 'friends_count', 5, 'common'),
  ('League Climber', 'Get promoted from a league', '📈', 50, 'league_promotions', 1, 'common'),
  ('Diamond Status', 'Reach Diamond League', '💠', 1000, 'league_reached', 10, 'legendary'),
  ('Euler''s Apprentice', 'Unlock the AI Math Agent', '🤖', 10000, 'ai_unlocked', 1, 'legendary');

-- Seed Shop Items
INSERT INTO shop_items (name, description, type, cost_gems, cost_real_money) VALUES
  ('Streak Freeze', 'Protect your streak for one day if you miss practice', 'streak_freeze', 200, 1.99),
  ('Heart Refill', 'Refill all your hearts instantly', 'heart_refill', 350, 2.99),
  ('Double XP (1 hour)', 'Earn double XP for the next hour', 'xp_boost', 300, 2.49),
  ('Double XP (24 hours)', 'Earn double XP for the next 24 hours', 'xp_boost', 500, 4.99),
  ('Robot Avatar', 'A cute robot avatar for your profile', 'avatar', 500, NULL),
  ('Astronaut Avatar', 'An astronaut exploring math space', 'avatar', 500, NULL),
  ('Wizard Avatar', 'A mathematical wizard avatar', 'avatar', 750, NULL),
  ('Gold Crown', 'A golden crown cosmetic for your avatar', 'cosmetic', 1000, NULL),
  ('Rainbow Trail', 'Leave a rainbow trail on the leaderboard', 'cosmetic', 800, NULL),
  ('Euler''s Hat', 'A special hat inspired by Leonhard Euler', 'cosmetic', 1500, NULL);
