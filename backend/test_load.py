import tensorflow as tf
import h5py
import json

def _fix_config(cfg):
    if isinstance(cfg, dict):
        if cfg.get("class_name") == "InputLayer":
            inner = cfg.get("config", {})
            if "batch_shape" in inner:
                inner["batch_input_shape"] = inner.pop("batch_shape")
                
        if "dtype" in cfg and isinstance(cfg["dtype"], dict):
            if cfg["dtype"].get("class_name") == "DTypePolicy":
                config_inner = cfg["dtype"].get("config", {})
                cfg["dtype"] = config_inner.get("name", "float32")
                
        return {k: _fix_config(v) for k, v in cfg.items()}
    elif isinstance(cfg, list):
        return [_fix_config(item) for item in cfg]
    return cfg

def load_compat(path):
    print(f"Loading {path}...")
    try:
        return tf.keras.models.load_model(path, compile=False)
    except Exception as e1:
        print(f"Standard load failed: {e1}")
        
    try:
        with h5py.File(path, "r+") as f:
            raw_config = f.attrs.get("model_config")
            if isinstance(raw_config, bytes):
                raw_config = raw_config.decode("utf-8")
            config = json.loads(raw_config)
            fixed_config = _fix_config(config)
            f.attrs["model_config"] = json.dumps(fixed_config).encode("utf-8")
            
        print("Config patched, reloading...")
        return tf.keras.models.load_model(path, compile=False)
    except Exception as e2:
        print(f"Patch load failed: {e2}")

load_compat("model/retina_model.h5")
load_compat("model/retina_87_model.h5")
