# [moWebJam](https://github.com/molab-itp/moWebJam)

- reload web pages that fail after running for long period
- remix of public web sites with electron for big screen installations
- and remote control via mobile devices using qrcode

## let america be

- https://poets.org/poem/let-america-be-america-again

## notes

```
after restart need to kill main process

./run-vote.sh

setup for run-vote
default to not init db and show qrcode at bottom

my.mo_app

  if (my.mo_app) {
    webPreferences.preload = path.join(__dirname, './cjs/preload-scroll.cjs');

```

```
jht2@10-20-93-88 moWebJam % cd node
jht2@10-20-93-88 node % ./run-alter-ego.sh

> desktop-import@1.0.0 start
> electron . --js-flags="--expose-gc" --restart_period 2:30:0 --full 0 --portrait 0.90 --screen 1 --root https://www.youtube.com/live/zJxFKxA5lT0?si=OmL3Q6I0hE-Z59B9&t=758 --preload .

__dirname /Users/jht2/Documents/projects/2024-moSalon/moWebJam/node
download_path /Users/jht2/Downloads
Unknown arg val --js-flags=--expose-gc
root_index_path: https://www.youtube.com/live/zJxFKxA5lT0?si=OmL3Q6I0hE-Z59B9&t=758
opt { h: 1, restart_period: '2:30:0', fullScreen: 0, index: '1' }
x 1588 width 972 height 1728
my.preload_arg |.|
[24991:0909/092158.596696:ERROR:web_contents_preferences.cc(239)] preload script must have absolute path.
parse_period secs 9000
my.mo_app undefined my.mo_room undefined my.mo_group undefined
[24991:0909/092200.623913:ERROR:debug_utils.cc(14)] Hit debug scenario: 4
sysctlbyname for kern.hv_vmm_present failed with status -1

```
