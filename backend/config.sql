CREATE TABLE [Annotator] (  
	[DataId] INTEGER  PRIMARY KEY NOT NULL,
	[User] NVARCHAR(50) NOT NULL,
	[TaskCount] INTEGER NULL,
    [UserCreatedAt] DATETIME NULL
);     

CREATE TABLE [Annotation] (  
	[DataId] INTEGER  PRIMARY KEY NOT NULL,
	[User] NVARCHAR(50) NOT NULL, 
	[TaskOrder] INTEGER NULL,
	[TaskLength] INTEGER NULL,
    [Emotion] TEXT NULL,
	[Data] TEXT  NULL,   
	[TaskCreatedAt] DATETIME NULL,
    [TaskStartedAt] DATETIME NULL,
    [TaskEndedAt] DATETIME NULL
);     