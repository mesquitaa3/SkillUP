-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           11.7.2-MariaDB - mariadb.org binary distribution
-- SO do servidor:               Win64
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- A despejar estrutura da base de dados para skillup
DROP DATABASE IF EXISTS `skillup`;
CREATE DATABASE IF NOT EXISTS `skillup` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `skillup`;

-- A despejar estrutura para tabela skillup.alunos
DROP TABLE IF EXISTS `alunos`;
CREATE TABLE IF NOT EXISTS `alunos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilizador_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilizador_id` (`utilizador_id`),
  CONSTRAINT `alunos_ibfk_1` FOREIGN KEY (`utilizador_id`) REFERENCES `utilizadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.alunos: ~3 rows (aproximadamente)
DELETE FROM `alunos`;
INSERT INTO `alunos` (`id`, `utilizador_id`) VALUES
	(4, 7),
	(5, 8),
	(6, 10);

-- A despejar estrutura para tabela skillup.cursos
DROP TABLE IF EXISTS `cursos`;
CREATE TABLE IF NOT EXISTS `cursos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `duracao` varchar(50) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `instrutor_id` int(11) NOT NULL,
  `data_criacao` timestamp NULL DEFAULT current_timestamp(),
  `visivel` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.cursos: ~5 rows (aproximadamente)
DELETE FROM `cursos`;
INSERT INTO `cursos` (`id`, `titulo`, `descricao`, `duracao`, `preco`, `imagem`, `instrutor_id`, `data_criacao`, `visivel`) VALUES
	(4, 'teste-rui', 'hasudghasduhasd', '100', 0.01, '1747169424397-Logotipo-V-CBS-ISCAC-Color.png', 3, '2025-05-13 20:50:24', 1),
	(5, 'teste2', 'teste2', '10', 1.00, '1747390956406-169624729-2_p067952_1_6ad740ff_thumbnail_256.jpg', 3, '2025-05-16 10:22:36', 1),
	(6, 'testesinstrutor', 'instrutor', '20', 0.01, '1747392140577-359249247-2_p067952_1_6ad740ff_thumbnail_256.jpg', 4, '2025-05-16 10:42:20', 1),
	(7, 'teste1233', 'teste1233', '10', 10.00, NULL, 4, '2025-05-16 12:02:29', 1),
	(8, 'teste3', 'teste3', '10', 10.00, NULL, 4, '2025-05-16 16:41:34', 1);

-- A despejar estrutura para tabela skillup.exercicios
DROP TABLE IF EXISTS `exercicios`;
CREATE TABLE IF NOT EXISTS `exercicios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tarefa` int(11) NOT NULL,
  `pergunta` text NOT NULL,
  `tipo` enum('escolha_multipla','aberta') DEFAULT 'escolha_multipla',
  PRIMARY KEY (`id`),
  KEY `id_tarefa` (`id_tarefa`),
  CONSTRAINT `exercicios_ibfk_1` FOREIGN KEY (`id_tarefa`) REFERENCES `tarefas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.exercicios: ~4 rows (aproximadamente)
DELETE FROM `exercicios`;
INSERT INTO `exercicios` (`id`, `id_tarefa`, `pergunta`, `tipo`) VALUES
	(2, 2, 'teste', 'escolha_multipla'),
	(3, 2, 'ola', 'escolha_multipla'),
	(4, 4, 'teste1', 'escolha_multipla'),
	(6, 4, 'teste2', 'escolha_multipla');

-- A despejar estrutura para tabela skillup.ficheiros
DROP TABLE IF EXISTS `ficheiros`;
CREATE TABLE IF NOT EXISTS `ficheiros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `curso_id` int(11) NOT NULL,
  `tarefa_id` int(11) DEFAULT NULL,
  `nome_ficheiro` varchar(255) DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `data_upload` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.ficheiros: ~3 rows (aproximadamente)
DELETE FROM `ficheiros`;
INSERT INTO `ficheiros` (`id`, `curso_id`, `tarefa_id`, `nome_ficheiro`, `tipo`, `data_upload`) VALUES
	(4, 4, NULL, '1747334915734-553744097-atividade-4-distribuicao.pdf', 'application/pdf', '2025-05-15 19:48:35'),
	(5, 4, NULL, '1747335044900-530702548-atividade-4-distribuicao.pdf', 'application/pdf', '2025-05-15 19:50:44'),
	(7, 6, 4, '1747392382004-329003203-atividade-4-distribuicao.pdf', 'application/pdf', '2025-05-16 11:46:22');

-- A despejar estrutura para tabela skillup.inscricoes
DROP TABLE IF EXISTS `inscricoes`;
CREATE TABLE IF NOT EXISTS `inscricoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_aluno` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `data_inscricao` datetime DEFAULT current_timestamp(),
  `estado_pagamento` enum('pendente','pago') DEFAULT 'pendente',
  PRIMARY KEY (`id`),
  KEY `id_aluno` (`id_aluno`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `inscricoes_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `alunos` (`id`),
  CONSTRAINT `inscricoes_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.inscricoes: ~2 rows (aproximadamente)
DELETE FROM `inscricoes`;
INSERT INTO `inscricoes` (`id`, `id_aluno`, `id_curso`, `data_inscricao`, `estado_pagamento`) VALUES
	(2, 4, 4, '2025-05-15 11:24:38', 'pago'),
	(3, 6, 4, '2025-05-16 11:52:19', 'pago');

-- A despejar estrutura para tabela skillup.instrutores
DROP TABLE IF EXISTS `instrutores`;
CREATE TABLE IF NOT EXISTS `instrutores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilizador_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilizador_id` (`utilizador_id`),
  CONSTRAINT `instrutores_ibfk_1` FOREIGN KEY (`utilizador_id`) REFERENCES `utilizadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.instrutores: ~2 rows (aproximadamente)
DELETE FROM `instrutores`;
INSERT INTO `instrutores` (`id`, `utilizador_id`) VALUES
	(3, 6),
	(4, 9);

-- A despejar estrutura para tabela skillup.opcoes_exercicio
DROP TABLE IF EXISTS `opcoes_exercicio`;
CREATE TABLE IF NOT EXISTS `opcoes_exercicio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_exercicio` int(11) NOT NULL,
  `texto_opcao` text NOT NULL,
  `correta` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `id_exercicio` (`id_exercicio`),
  CONSTRAINT `opcoes_exercicio_ibfk_1` FOREIGN KEY (`id_exercicio`) REFERENCES `exercicios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.opcoes_exercicio: ~12 rows (aproximadamente)
DELETE FROM `opcoes_exercicio`;
INSERT INTO `opcoes_exercicio` (`id`, `id_exercicio`, `texto_opcao`, `correta`) VALUES
	(3, 2, '1', 0),
	(4, 2, '2', 0),
	(5, 2, '3', 1),
	(6, 3, 'adeus', 1),
	(7, 3, 'adeus', 0),
	(8, 3, 'boas', 0),
	(9, 4, 'ola', 1),
	(10, 4, 'adeus', 0),
	(11, 4, 'boas', 0),
	(15, 6, 'um', 0),
	(16, 6, 'dois', 0),
	(17, 6, 'tres', 1);

-- A despejar estrutura para tabela skillup.respostas_aluno
DROP TABLE IF EXISTS `respostas_aluno`;
CREATE TABLE IF NOT EXISTS `respostas_aluno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_exercicio` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `id_opcao_escolhida` int(11) DEFAULT NULL,
  `data_submissao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_exercicio` (`id_exercicio`),
  KEY `id_aluno` (`id_aluno`),
  KEY `id_opcao_escolhida` (`id_opcao_escolhida`),
  CONSTRAINT `respostas_aluno_ibfk_1` FOREIGN KEY (`id_exercicio`) REFERENCES `exercicios` (`id`),
  CONSTRAINT `respostas_aluno_ibfk_2` FOREIGN KEY (`id_aluno`) REFERENCES `alunos` (`id`),
  CONSTRAINT `respostas_aluno_ibfk_3` FOREIGN KEY (`id_opcao_escolhida`) REFERENCES `opcoes_exercicio` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.respostas_aluno: ~10 rows (aproximadamente)
DELETE FROM `respostas_aluno`;
INSERT INTO `respostas_aluno` (`id`, `id_exercicio`, `id_aluno`, `id_opcao_escolhida`, `data_submissao`) VALUES
	(1, 2, 4, 5, '2025-05-15 19:38:50'),
	(2, 2, 4, 3, '2025-05-15 19:48:01'),
	(3, 2, 4, 4, '2025-05-15 19:48:05'),
	(4, 2, 4, 5, '2025-05-15 19:48:07'),
	(5, 2, 4, 5, '2025-05-15 19:51:09'),
	(6, 3, 4, 8, '2025-05-15 19:51:12'),
	(7, 3, 4, 7, '2025-05-15 19:51:15'),
	(8, 3, 4, 6, '2025-05-15 19:51:17'),
	(9, 2, 6, 3, '2025-05-16 11:54:07'),
	(10, 2, 6, 5, '2025-05-16 11:54:13');

-- A despejar estrutura para tabela skillup.tarefas
DROP TABLE IF EXISTS `tarefas`;
CREATE TABLE IF NOT EXISTS `tarefas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_curso` int(11) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `data_criacao` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `tarefas_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.tarefas: ~2 rows (aproximadamente)
DELETE FROM `tarefas`;
INSERT INTO `tarefas` (`id`, `id_curso`, `titulo`, `descricao`, `data_criacao`) VALUES
	(2, 4, 'teste12', 'teste12', '2025-05-14 22:45:15'),
	(4, 6, 'testes-tarefa', 'tarefa-testes', '2025-05-16 10:45:48');

-- A despejar estrutura para tabela skillup.utilizadores
DROP TABLE IF EXISTS `utilizadores`;
CREATE TABLE IF NOT EXISTS `utilizadores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `passe` varchar(255) NOT NULL,
  `cargo` enum('aluno','instrutor') NOT NULL,
  `data_criacao` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- A despejar dados para tabela skillup.utilizadores: ~5 rows (aproximadamente)
DELETE FROM `utilizadores`;
INSERT INTO `utilizadores` (`id`, `nome`, `email`, `passe`, `cargo`, `data_criacao`) VALUES
	(6, 'Diogo Mesquita', 'instrutor@gmail.com', '$2b$10$Oles0P2cwoUh/aCfsLih3OAZSCtJAKpE6uZDp5J1hO2DyRvg2HRyC', 'instrutor', '2025-05-13 20:07:02'),
	(7, 'Diogo Mesquita', 'aluno@gmail.com', '$2b$10$eYufOeqMIpRkQhjwoVHaceiaN2eTkktgGcOpipYMD39s5Ca/wZR9W', 'aluno', '2025-05-13 20:07:17'),
	(8, 'teste2', 'teste2@gmail.com', '$2b$10$kzPIMjXlOvxFzwuCuScP/eKvAwrbYKoNM0jksBO94doz8jFRMl0JS', 'aluno', '2025-05-15 17:33:35'),
	(9, 'teste1', 'testeinstrutor@gmail.com', '$2b$10$jQXmR49FmP2OGhtT61rVweN0Xe1UbHi7K.Vs1S05wiQx93tl77DSe', 'instrutor', '2025-05-16 10:41:20'),
	(10, 'testealuno', 'testealuno@gmail.com', '$2b$10$fisM1M.FjTSJGOF9kHqiTODJjrDfpHMlT9gooM1I22UIp9q5FESCa', 'aluno', '2025-05-16 10:49:41');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
