CREATE TABLE `teste_tcc`.`cmt` (
  `idcomentario` INT NOT NULL AUTO_INCREMENT,
  `comentario` LONGTEXT NOT NULL,
  `opcao_select` VARCHAR(255) NOT NULL,
  `opcao_select2` VARCHAR(255) NULL DEFAULT NULL,
  `fk_idtabfin` INT NOT NULL,
  `tabfin_camp` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idcomentario`));