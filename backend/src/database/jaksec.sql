-- --------------------------------------------------------
-- Verkkotietokone:              127.0.0.1
-- Palvelinversio:               10.11.0-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Versio:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for jaksec
CREATE DATABASE IF NOT EXISTS `jaksec` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `jaksec`;

-- Dumping structure for taulu jaksec.attendance
CREATE TABLE IF NOT EXISTS `attendance` (
  `status` int(11) NOT NULL,
  `date` date NOT NULL,
  `attendanceid` int(11) NOT NULL AUTO_INCREMENT,
  `usercourseid` int(11) NOT NULL,
  `classid` int(11) NOT NULL,
  PRIMARY KEY (`attendanceid`),
  KEY `usercourseid` (`usercourseid`),
  KEY `classid` (`classid`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`usercourseid`) REFERENCES `usercourses` (`usercourseid`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`classid`) REFERENCES `class` (`classid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table jaksec.attendance: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.class
CREATE TABLE IF NOT EXISTS `class` (
  `classid` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `topicid` int(11) NOT NULL,
  `usercourseid` int(11) NOT NULL,
  PRIMARY KEY (`classid`),
  KEY `topicid` (`topicid`),
  KEY `usercourseid` (`usercourseid`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`topicid`) REFERENCES `topics` (`topicid`),
  CONSTRAINT `class_ibfk_2` FOREIGN KEY (`usercourseid`) REFERENCES `usercourses` (`usercourseid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table jaksec.class: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
/*!40000 ALTER TABLE `class` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.courseinstructors
CREATE TABLE IF NOT EXISTS `courseinstructors` (
  `courseid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  KEY `courseid` (`courseid`),
  KEY `userid` (`userid`),
  CONSTRAINT `courseinstructors_ibfk_1` FOREIGN KEY (`courseid`) REFERENCES `courses` (`courseid`),
  CONSTRAINT `courseinstructors_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table jaksec.courseinstructors: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `courseinstructors` DISABLE KEYS */;
/*!40000 ALTER TABLE `courseinstructors` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.courses
CREATE TABLE IF NOT EXISTS `courses` (
  `courseid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `created_at` timestamp NOT NULL,
  `end_date` date NOT NULL,
  `code` varchar(20) NOT NULL,
  `studentgroupid` int(11) DEFAULT NULL,
  PRIMARY KEY (`courseid`),
  KEY `studentgroupid` (`studentgroupid`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`studentgroupid`) REFERENCES `studentgroups` (`studentgroupid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table jaksec.courses: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.coursetopics
CREATE TABLE IF NOT EXISTS `coursetopics` (
  `courseid` int(11) NOT NULL,
  `topicid` int(11) NOT NULL,
  KEY `courseid` (`courseid`),
  KEY `topicid` (`topicid`),
  CONSTRAINT `coursetopics_ibfk_1` FOREIGN KEY (`courseid`) REFERENCES `courses` (`courseid`),
  CONSTRAINT `coursetopics_ibfk_2` FOREIGN KEY (`topicid`) REFERENCES `topics` (`topicid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table jaksec.coursetopics: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `coursetopics` DISABLE KEYS */;
/*!40000 ALTER TABLE `coursetopics` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `roleid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Inserting data into jaksec.roles
INSERT INTO roles ( name) VALUES
('student'),
('counselor'),
('teacher'),
('admin');

-- Dumping data for table jaksec.roles: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.studentgroups
CREATE TABLE IF NOT EXISTS `studentgroups` (
  `studentgroupid` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(20) NOT NULL,
  PRIMARY KEY (`studentgroupid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table jaksec.studentgroups: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `studentgroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentgroups` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.topics
CREATE TABLE IF NOT EXISTS `topics` (
  `topicid` int(11) NOT NULL AUTO_INCREMENT,
  `topicname` varchar(64) NOT NULL,
  PRIMARY KEY (`topicid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `topicgroup` (
  `topicgroupid` int(11) NOT NULL AUTO_INCREMENT,
  `topicgroupname` varchar(64) NOT NULL,
  `topicid` int(11) NOT NULL,
  PRIMARY KEY (`topicgroupid`),
  FOREIGN KEY (`topicid`) REFERENCES `topics`(`topicid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
-- Dumping data for table jaksec.topics: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `topics` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.usercourses
CREATE TABLE IF NOT EXISTS `usercourses` (
  `usercourseid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  PRIMARY KEY (`usercourseid`),
  KEY `userid` (`userid`),
  KEY `courseid` (`courseid`),
  CONSTRAINT `usercourses_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  CONSTRAINT `usercourses_ibfk_2` FOREIGN KEY (`courseid`) REFERENCES `courses` (`courseid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table jaksec.usercourses: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `usercourses` DISABLE KEYS */;
/*!40000 ALTER TABLE `usercourses` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.usercourse_topics
CREATE TABLE IF NOT EXISTS `usercourse_topics` (
  `usercourseid` int(11) NOT NULL,
  `topicid` int(11) NOT NULL,
  KEY `usercourseid` (`usercourseid`),
  KEY `topicid` (`topicid`),
  CONSTRAINT `usercourse_topics_ibfk_1` FOREIGN KEY (`usercourseid`) REFERENCES `usercourses` (`usercourseid`),
  CONSTRAINT `usercourse_topics_ibfk_2` FOREIGN KEY (`topicid`) REFERENCES `topics` (`topicid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table jaksec.usercourse_topics: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `usercourse_topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `usercourse_topics` ENABLE KEYS */;

-- Dumping structure for taulu jaksec.users
CREATE TABLE IF NOT EXISTS `users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `staff` int(11) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL,
  `studentnumber` int(11) DEFAULT NULL,
  `studentgroupid` int(11) DEFAULT NULL,
  `roleid` int(11) NOT NULL DEFAULT '1',
  `GDPR` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userid`),
  KEY `studentgroupid` (`studentgroupid`),
  KEY `roleid` (`roleid`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`studentgroupid`) REFERENCES `studentgroups` (`studentgroupid`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`roleid`) REFERENCES `roles` (`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Inserting data into jaksec.users
INSERT INTO `users` (`username`, `email`, `staff`, `first_name`, `last_name`, `created_at`, `studentnumber`, `studentgroupid`, `roleid`, `GDPR`) 
VALUES ('MrAnderson', 'mr.anderson@example.com', 1, 'Mr', 'Anderson', NOW(), NULL, NULL, 4, 1);
-- Dumping data for table jaksec.users: ~0 rows (suunnilleen)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

-- Test users
INSERT INTO `users` (`username`, `email`, `staff`, `first_name`, `last_name`, `created_at`, `roleid`, `GDPR`) 
VALUES 
('admin', 'admin@metropolia.fi', 1, 'Admin', 'Admin', NOW(), 4, 1),
('teacher', 'teacher@metropolia.fi', 1, 'Teacher', 'Teacher', NOW(), 3, 1),
('counselor', 'counselor@metropolia.fi', 1, 'Counselor', 'Counselor', NOW(), 2, 1),
('student', 'student@metropolia.fi', 0, 'Student', 'Student', NOW(),1, 1);