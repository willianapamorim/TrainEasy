package com.traineasy.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.traineasy.dto.MetaRequest;
import com.traineasy.dto.MetaResponse;
import com.traineasy.entity.Meta;
import com.traineasy.repository.MetaRepository;

@Service
public class MetaService {

    private final MetaRepository metaRepository;

    public MetaService(MetaRepository metaRepository) {
        this.metaRepository = metaRepository;
    }

    public MetaResponse criar(MetaRequest request) {
        Meta meta = new Meta();
        meta.setTitulo(request.getTitulo());
        meta.setDescricao(request.getDescricao());
        meta.setUserId(request.getUserId());
        meta.setConcluida(false);

        Meta saved = metaRepository.save(meta);
        return MetaResponse.success("Meta cadastrada com sucesso!", toData(saved));
    }

    public MetaResponse listarPorUsuario(Long userId) {
        List<Meta> metas = metaRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<MetaResponse.MetaData> lista = metas.stream().map(this::toData).toList();
        return MetaResponse.successList("Metas carregadas.", lista);
    }

    @Transactional
    public MetaResponse atualizar(Long id, MetaRequest request) {
        Meta meta = metaRepository.findById(id).orElse(null);
        if (meta == null) {
            return MetaResponse.error("Meta não encontrada.");
        }

        if (request.getTitulo() != null) {
            meta.setTitulo(request.getTitulo());
        }
        if (request.getDescricao() != null) {
            meta.setDescricao(request.getDescricao());
        }
        if (request.getConcluida() != null) {
            meta.setConcluida(request.getConcluida());
        }

        Meta saved = metaRepository.save(meta);
        return MetaResponse.success("Meta atualizada com sucesso!", toData(saved));
    }

    public MetaResponse excluir(Long id) {
        if (!metaRepository.existsById(id)) {
            return MetaResponse.error("Meta não encontrada.");
        }
        metaRepository.deleteById(id);
        return MetaResponse.success("Meta excluída com sucesso!", null);
    }

    private MetaResponse.MetaData toData(Meta meta) {
        return new MetaResponse.MetaData(
                meta.getId(),
                meta.getTitulo(),
                meta.getDescricao(),
                meta.getConcluida(),
                meta.getUserId(),
                meta.getCreatedAt());
    }
}
