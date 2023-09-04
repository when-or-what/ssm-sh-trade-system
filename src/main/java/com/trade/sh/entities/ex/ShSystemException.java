package com.trade.sh.entities.ex;

import com.trade.sh.utils.ResultEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShSystemException extends RuntimeException {
    private Integer state;
    private String message;

    public ShSystemException(ResultEnum resultEnum) {
        this.state = resultEnum.getState();
        this.message = resultEnum.getMessage();
    }
}
