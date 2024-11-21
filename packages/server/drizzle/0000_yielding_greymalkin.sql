CREATE TABLE `suit_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`startTime` integer,
	`totalPurchaseCount` integer,
	`user` integer,
	`username` text,
	`owner` integer,
	`image_cover` text
);
