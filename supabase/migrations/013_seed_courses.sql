-- Seed: Two sample courses with modules and video lessons
DO $$
DECLARE
  admin_id UUID;
  course1_id UUID;
  course2_id UUID;
  module1_id UUID;
  module2_id UUID;
  module3_id UUID;
  module4_id UUID;
BEGIN
  SELECT id INTO admin_id
  FROM public.users
  WHERE role = 'admin'
  ORDER BY created_at ASC
  LIMIT 1;

  IF admin_id IS NULL THEN
    RAISE NOTICE 'No admin user found. Skipping course seed.';
    RETURN;
  END IF;

  -- Course 1
  SELECT id INTO course1_id
  FROM public.courses
  WHERE title = 'Digital Marketing Foundations'
  LIMIT 1;

  IF course1_id IS NULL THEN
    INSERT INTO public.courses (title, description, price, status, created_by, estimated_time)
    VALUES (
      'Digital Marketing Foundations',
      'Learn the core pillars of digital marketing and build a practical campaign step-by-step.',
      149.00,
      'published',
      admin_id,
      180
    )
    RETURNING id INTO course1_id;
  END IF;

  SELECT id INTO module1_id
  FROM public.modules
  WHERE course_id = course1_id AND title = 'Marketing Strategy Basics'
  LIMIT 1;

  IF module1_id IS NULL THEN
    INSERT INTO public.modules (course_id, title, description, order_index, estimated_time)
    VALUES (
      course1_id,
      'Marketing Strategy Basics',
      'Define your audience, value proposition, and campaign objectives.',
      1,
      60
    )
    RETURNING id INTO module1_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module1_id AND title = 'Audience Research 101'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course1_id,
      module1_id,
      'Audience Research 101',
      'Identify the right audience segments and their needs.',
      'Define personas, pain points, and buying triggers.',
      'https://www.youtube.com/watch?v=V2Dg6wZocqY',
      'mixed',
      1,
      20
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module1_id AND title = 'Positioning Your Offer'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course1_id,
      module1_id,
      'Positioning Your Offer',
      'Craft a clear and compelling value proposition.',
      'Learn frameworks to position your product in a crowded market.',
      'https://www.youtube.com/watch?v=Y0w9fQ2uL1g',
      'mixed',
      2,
      20
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module1_id AND title = 'Campaign Goals and KPIs'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course1_id,
      module1_id,
      'Campaign Goals and KPIs',
      'Set goals and choose the right metrics.',
      'Use SMART goals and map KPIs to your funnel.',
      'https://www.youtube.com/watch?v=2E4JZfYwqYk',
      'mixed',
      3,
      20
    );
  END IF;

  SELECT id INTO module2_id
  FROM public.modules
  WHERE course_id = course1_id AND title = 'Content and Ads'
  LIMIT 1;

  IF module2_id IS NULL THEN
    INSERT INTO public.modules (course_id, title, description, order_index, estimated_time)
    VALUES (
      course1_id,
      'Content and Ads',
      'Create content pillars and launch your first ad campaign.',
      2,
      60
    )
    RETURNING id INTO module2_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module2_id AND title = 'Content Planning'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course1_id,
      module2_id,
      'Content Planning',
      'Build a content calendar that aligns with your goals.',
      'Learn how to plan weekly content with clear themes.',
      'https://www.youtube.com/watch?v=I2zq72hQjIY',
      'mixed',
      1,
      20
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module2_id AND title = 'Intro to Paid Ads'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course1_id,
      module2_id,
      'Intro to Paid Ads',
      'Understand ad platforms and budgeting basics.',
      'Overview of Meta and Google ads with budget tips.',
      'https://www.youtube.com/watch?v=6czvJ0Q6d2E',
      'mixed',
      2,
      20
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module2_id AND title = 'Creative Testing'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course1_id,
      module2_id,
      'Creative Testing',
      'Test ad creatives and improve performance.',
      'Learn how to run simple A/B tests.',
      'https://www.youtube.com/watch?v=K7n0H1dZewQ',
      'mixed',
      3,
      20
    );
  END IF;

  -- Course 2
  SELECT id INTO course2_id
  FROM public.courses
  WHERE title = 'IELTS Writing Mastery'
  LIMIT 1;

  IF course2_id IS NULL THEN
    INSERT INTO public.courses (title, description, price, status, created_by, estimated_time)
    VALUES (
      'IELTS Writing Mastery',
      'Boost your IELTS writing score with task-specific strategies and practice.',
      129.00,
      'published',
      admin_id,
      150
    )
    RETURNING id INTO course2_id;
  END IF;

  SELECT id INTO module3_id
  FROM public.modules
  WHERE course_id = course2_id AND title = 'Task 1 Essentials'
  LIMIT 1;

  IF module3_id IS NULL THEN
    INSERT INTO public.modules (course_id, title, description, order_index, estimated_time)
    VALUES (
      course2_id,
      'Task 1 Essentials',
      'Learn how to analyze visuals and structure Task 1 responses.',
      1,
      60
    )
    RETURNING id INTO module3_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module3_id AND title = 'Understanding Task 1'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course2_id,
      module3_id,
      'Understanding Task 1',
      'Key components of a high-scoring Task 1 response.',
      'Break down the question types and required structure.',
      'https://www.youtube.com/watch?v=F2yVw2F7N8E',
      'mixed',
      1,
      20
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module3_id AND title = 'Data Overview Statements'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course2_id,
      module3_id,
      'Data Overview Statements',
      'Write strong overview paragraphs.',
      'Focus on trends, comparisons, and key features.',
      'https://www.youtube.com/watch?v=qk3b2YtM0WU',
      'mixed',
      2,
      20
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module3_id AND title = 'Common Mistakes to Avoid'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course2_id,
      module3_id,
      'Common Mistakes to Avoid',
      'Avoid the pitfalls that lower scores.',
      'Grammar, data misinterpretation, and structure errors.',
      'https://www.youtube.com/watch?v=lG6w5x3P8fQ',
      'mixed',
      3,
      20
    );
  END IF;

  SELECT id INTO module4_id
  FROM public.modules
  WHERE course_id = course2_id AND title = 'Task 2 Essay Strategy'
  LIMIT 1;

  IF module4_id IS NULL THEN
    INSERT INTO public.modules (course_id, title, description, order_index, estimated_time)
    VALUES (
      course2_id,
      'Task 2 Essay Strategy',
      'Plan, structure, and write impactful essays.',
      2,
      60
    )
    RETURNING id INTO module4_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module4_id AND title = 'Essay Structure Blueprint'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course2_id,
      module4_id,
      'Essay Structure Blueprint',
      'Learn a reliable structure for Task 2.',
      'Intro, body paragraphs, and conclusion templates.',
      'https://www.youtube.com/watch?v=QnL3a7rjzCQ',
      'mixed',
      1,
      20
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module4_id AND title = 'Developing Strong Arguments'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course2_id,
      module4_id,
      'Developing Strong Arguments',
      'Use evidence and examples effectively.',
      'Practice building logical and persuasive arguments.',
      'https://www.youtube.com/watch?v=9fIYqgU2pUQ',
      'mixed',
      2,
      20
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.lessons WHERE module_id = module4_id AND title = 'Cohesion and Coherence'
  ) THEN
    INSERT INTO public.lessons (course_id, module_id, title, description, content, video_url, content_type, order_index, estimated_time)
    VALUES (
      course2_id,
      module4_id,
      'Cohesion and Coherence',
      'Improve flow and linking in your writing.',
      'Linking words, paragraph flow, and clarity tips.',
      'https://www.youtube.com/watch?v=0G7s3iSxB2k',
      'mixed',
      3,
      20
    );
  END IF;
END $$;
