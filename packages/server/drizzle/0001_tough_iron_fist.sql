CREATE TABLE `vocabularys` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`original` text(256) NOT NULL,
	`translation` text(256) NOT NULL,
	`phonetic` text(256),
	`tags` text(256),
	`level` integer,
	`created_at` integer,
	`updated_at` integer
);
