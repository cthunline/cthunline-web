import { type SVGProps } from 'react';

import classes from './ApocalypseWorldHarmPie.module.css';

interface ApocalypseWorldHarmPieProps extends SVGProps<SVGSVGElement> {
    readonly?: boolean;
    activeValue?: number;
    onSliceClick?: (val: number) => void;
    onClear?: () => void;
}

const ApocalypseWorldHarmPie = ({
    readonly,
    activeValue,
    onSliceClick,
    onClear,
    ...props
}: ApocalypseWorldHarmPieProps) => (
    <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        className={`${classes.pie} ${readonly ? classes.readonly : ''} ${props.className ?? ''}`}
    >
        <g>
            <g
                className={`${classes.sliceGroup} ${activeValue && activeValue === 1 ? classes.active : ''}`}
                onClick={() => {
                    if (!readonly) {
                        onSliceClick?.(1);
                    }
                }}
            >
                <path
                    className={classes.sliceContainer}
                    d="M 50 0.099609375 L 50 40.699219 A 9.3000002 9.3000002 0 0 1 51.041016 40.757812 A 9.3000002 9.3000002 0 0 1 52.070312 40.933594 A 9.3000002 9.3000002 0 0 1 53.072266 41.222656 A 9.3000002 9.3000002 0 0 1 54.035156 41.621094 A 9.3000002 9.3000002 0 0 1 54.947266 42.125 A 9.3000002 9.3000002 0 0 1 55.798828 42.728516 A 9.3000002 9.3000002 0 0 1 56.576172 43.423828 A 9.3000002 9.3000002 0 0 1 57.271484 44.201172 A 9.3000002 9.3000002 0 0 1 57.875 45.052734 A 9.3000002 9.3000002 0 0 1 58.378906 45.964844 A 9.3000002 9.3000002 0 0 1 58.777344 46.927734 A 9.3000002 9.3000002 0 0 1 59.066406 47.929688 A 9.3000002 9.3000002 0 0 1 59.242188 48.958984 A 9.3000002 9.3000002 0 0 1 59.300781 50 L 99.900391 50 A 49.900002 49.900002 0 0 0 50 0.099609375 z "
                />
                <path
                    className={classes.sliceBorder}
                    d="M 51.021484 40.738281 A 9.3185645 9.3185645 0 0 1 51.042969 40.740234 A 9.3185645 9.3185645 0 0 1 52.074219 40.916016 A 9.3185645 9.3185645 0 0 1 53.078125 41.205078 A 9.3185645 9.3185645 0 0 1 54.042969 41.603516 A 9.3185645 9.3185645 0 0 1 54.957031 42.109375 A 9.3185645 9.3185645 0 0 1 55.810547 42.714844 A 9.3185645 9.3185645 0 0 1 56.589844 43.410156 A 9.3185645 9.3185645 0 0 1 57.285156 44.189453 A 9.3185645 9.3185645 0 0 1 57.890625 45.042969 A 9.3185645 9.3185645 0 0 1 58.396484 45.957031 A 9.3185645 9.3185645 0 0 1 58.794922 46.921875 A 9.3185645 9.3185645 0 0 1 59.083984 47.925781 A 9.3185645 9.3185645 0 0 1 59.259766 48.957031 A 9.3185645 9.3185645 0 0 1 59.261719 49.005859 L 99.982422 49.005859 A 49.99961 49.999611 0 0 0 99.96875 48.255859 A 49.99961 49.999611 0 0 0 99.878906 46.511719 A 49.99961 49.999611 0 0 0 99.726562 44.773438 A 49.99961 49.999611 0 0 0 99.513672 43.041016 A 49.99961 49.999611 0 0 0 99.240234 41.318359 A 49.99961 49.999611 0 0 0 98.908203 39.603516 A 49.99961 49.999611 0 0 0 98.515625 37.904297 A 49.99961 49.999611 0 0 0 98.0625 36.21875 A 49.99961 49.999611 0 0 0 97.552734 34.548828 A 49.99961 49.999611 0 0 0 96.984375 32.898438 A 49.99961 49.999611 0 0 0 96.359375 31.269531 A 49.99961 49.999611 0 0 0 95.677734 29.664062 A 49.99961 49.999611 0 0 0 94.939453 28.082031 A 49.99961 49.999611 0 0 0 94.148438 26.525391 A 49.99961 49.999611 0 0 0 93.300781 25 A 49.99961 49.999611 0 0 0 92.402344 23.503906 A 49.99961 49.999611 0 0 0 91.451172 22.041016 A 49.99961 49.999611 0 0 0 90.570312 20.78125 C 90.497912 20.681146 90.426623 20.58 90.353516 20.480469 A 49.99961 49.999611 0 0 0 89.515625 19.371094 C 89.37554 19.190633 89.232394 19.012595 89.089844 18.833984 A 49.99961 49.999611 0 0 0 88.302734 17.861328 C 88.273879 17.827056 88.243797 17.793954 88.214844 17.759766 C 87.836198 17.312657 87.451817 16.870511 87.058594 16.4375 A 49.99961 49.999611 0 0 0 86.626953 15.974609 C 86.30933 15.632749 85.987678 15.294258 85.660156 14.960938 A 49.99961 49.999611 0 0 0 85.078125 14.378906 C 84.702926 14.010251 84.324033 13.645731 83.9375 13.289062 A 49.99961 49.999611 0 0 0 83.646484 13.017578 C 83.122831 12.541575 82.587275 12.075326 82.042969 11.621094 A 49.99961 49.999611 0 0 0 81.767578 11.396484 C 81.311828 11.021777 80.849893 10.65551 80.380859 10.296875 A 49.99961 49.999611 0 0 0 79.962891 9.9804688 C 79.457845 9.6031793 78.945874 9.2347168 78.427734 8.8769531 A 49.99961 49.999611 0 0 0 78.273438 8.7695312 C 77.657159 8.3469284 77.033153 7.9347501 76.396484 7.5390625 C 75.774349 7.1524063 75.141837 6.7814294 74.501953 6.421875 A 49.99961 49.999611 0 0 0 74.287109 6.3027344 C 73.693682 5.9729412 73.092308 5.6536969 72.484375 5.3476562 A 49.99961 49.999611 0 0 0 72.292969 5.25 C 71.623185 4.9166952 70.946806 4.6002108 70.261719 4.296875 C 69.553388 3.9832492 68.836198 3.6842163 68.109375 3.4023438 C 67.383281 3.1207541 66.648335 2.8556923 65.90625 2.6074219 C 65.165242 2.3595121 64.412576 2.1245206 63.654297 1.9101562 C 62.896692 1.6959828 62.134412 1.5011452 61.363281 1.3222656 C 60.590264 1.142948 59.812388 0.9844278 59.029297 0.84179688 C 58.244989 0.69894463 57.451879 0.57286337 56.654297 0.46679688 C 55.857397 0.36082141 55.056894 0.27327549 54.248047 0.20507812 C 53.440743 0.1370108 52.62494 0.086124346 51.804688 0.056640625 L 51.021484 0.02734375 L 51.021484 40.738281 Z"
                />
                <path
                    className={classes.sliceInner}
                    d="M 51.777344 39.998047 C 51.979355 40.031874 52.183175 40.055804 52.382812 40.101562 C 52.749108 40.185313 53.111796 40.289697 53.466797 40.414062 C 53.821142 40.537928 54.169085 40.680795 54.507812 40.84375 C 54.846677 41.006889 55.175832 41.18876 55.494141 41.388672 C 55.812796 41.588634 56.119596 41.806427 56.414062 42.041016 C 56.708645 42.276154 56.989969 42.526834 57.255859 42.792969 C 57.521505 43.058371 57.77117 43.340746 58.005859 43.634766 C 58.240898 43.929797 58.460042 44.235788 58.660156 44.554688 C 58.859915 44.87275 59.042031 45.202341 59.205078 45.541016 C 59.368124 45.879934 59.51073 46.227202 59.634766 46.582031 C 59.758962 46.936546 59.863426 47.299323 59.947266 47.666016 C 59.991425 47.858677 60.01377 48.055307 60.046875 48.25 L 99.212891 48.25 C 99.195392 47.724515 99.184252 47.196947 99.150391 46.675781 C 99.110457 46.061162 99.04864 45.453936 98.986328 44.845703 C 98.950675 44.509971 98.917203 44.173585 98.875 43.839844 C 98.833732 43.504999 98.784294 43.172562 98.736328 42.839844 C 98.662033 42.331242 98.587943 41.821828 98.498047 41.318359 C 98.464914 41.130499 98.425884 40.944928 98.390625 40.757812 C 98.270092 40.125948 98.14423 39.495576 98 38.873047 C 97.991299 38.835145 97.981444 38.797634 97.972656 38.759766 C 97.800805 38.026337 97.612266 37.300505 97.408203 36.580078 C 97.197012 35.834492 96.969482 35.09589 96.724609 34.365234 C 96.479737 33.634578 96.217111 32.912097 95.939453 32.197266 C 95.661793 31.482433 95.370101 30.774288 95.060547 30.076172 C 94.750996 29.378058 94.424538 28.69027 94.083984 28.009766 C 93.743431 27.329261 93.386284 26.658097 93.015625 25.996094 C 92.644965 25.334092 92.2612 24.677763 91.861328 24.035156 C 91.461456 23.392551 91.047332 22.762941 90.619141 22.140625 C 90.19095 21.518308 89.748584 20.907775 89.292969 20.306641 C 88.837352 19.705507 88.368867 19.114217 87.886719 18.535156 C 87.404573 17.956098 86.908177 17.388122 86.400391 16.832031 C 85.892603 16.275939 85.372377 15.729495 84.839844 15.197266 C 84.307313 14.665035 83.763414 14.146149 83.207031 13.638672 C 82.650649 13.131196 82.081293 12.634174 81.501953 12.152344 C 80.922613 11.670517 80.333825 11.203336 79.732422 10.748047 C 79.131017 10.292756 78.517106 9.8516842 77.894531 9.4238281 C 77.271958 8.9959725 76.638944 8.5811701 75.996094 8.1816406 C 75.353244 7.7821109 74.701295 7.3976543 74.039062 7.0273438 C 73.376831 6.6570333 72.70416 6.3011359 72.023438 5.9609375 C 71.342718 5.6207392 70.653394 5.2974745 69.955078 4.9882812 C 69.25676 4.6790884 68.550957 4.3847168 67.835938 4.1074219 C 67.120918 3.8301269 66.396842 3.5687226 65.666016 3.3242188 C 64.935187 3.0797148 64.19496 2.8494918 63.449219 2.6386719 C 62.703477 2.4278522 61.951168 2.2348364 61.191406 2.0585938 C 60.431644 1.8823511 59.667419 1.7267101 58.894531 1.5859375 C 58.201684 1.4597437 57.499875 1.3531218 56.796875 1.2558594 C 56.669094 1.2385407 56.542154 1.2175068 56.414062 1.2011719 C 55.887867 1.1328256 55.357418 1.0807038 54.826172 1.0292969 C 54.471604 0.99571379 54.118448 0.95960612 53.761719 0.93359375 C 53.451952 0.90986547 53.139495 0.89512746 52.828125 0.87695312 C 52.479216 0.85811154 52.128157 0.84551462 51.777344 0.83398438 L 51.777344 39.998047 Z"
                />
            </g>
            <g
                className={`${classes.sliceGroup} ${activeValue && activeValue === 2 ? classes.active : ''}`}
                onClick={() => {
                    if (!readonly) {
                        onSliceClick?.(2);
                    }
                }}
            >
                <path
                    className={classes.sliceContainer}
                    d="M 50 59.300781 L 50 99.900391 A 49.900002 49.900002 0 0 0 99.900391 50 L 59.300781 50 A 9.3000002 9.3000002 0 0 1 58.845703 52.873047 A 9.3000002 9.3000002 0 0 1 57.523438 55.466797 A 9.3000002 9.3000002 0 0 1 55.466797 57.523438 A 9.3000002 9.3000002 0 0 1 52.873047 58.845703 A 9.3000002 9.3000002 0 0 1 50 59.300781 z "
                />
                <path
                    className={classes.sliceBorder}
                    d="m 59.150391,51.021484 -0.0625,0.6875 c -0.01152,0.127451 -0.02619,0.254133 -0.04297,0.38086 -0.154491,0.669533 -0.379645,1.319182 -0.677734,1.9375 -0.300599,0.624199 -0.671224,1.211901 -1.103516,1.753906 -0.432386,0.542091 -0.924888,1.034792 -1.466797,1.466797 -0.542462,0.432419 -1.129562,0.803012 -1.753906,1.103515 -0.618136,0.297838 -1.269444,0.523221 -1.939453,0.677735 -0.13033,0.01689 -0.259644,0.03165 -0.390625,0.04297 l -0.691407,0.06055 V 100 l 0.783204,-0.0293 c 0.764487,-0.02786 1.692069,0.07505 2.582031,-0.173828 l -0.138672,0.02539 c 0.809156,-0.06861 1.608389,-0.157447 2.404297,-0.263672 0.796737,-0.106335 1.590552,-0.23175 2.375,-0.375 0.783337,-0.143042 1.559856,-0.302941 2.332031,-0.482422 0.771334,-0.179287 1.536266,-0.375575 2.292969,-0.589844 0.756557,-0.214227 1.505955,-0.446696 2.248047,-0.695312 0.74267,-0.248807 1.47642,-0.515471 2.201171,-0.796875 0.725928,-0.281857 1.443817,-0.580489 2.152344,-0.894532 0.708489,-0.314021 1.408507,-0.64257 2.09961,-0.988281 0.6914,-0.345856 1.37143,-0.708153 2.042968,-1.083984 0.671497,-0.375807 1.335362,-0.765773 1.988282,-1.171875 0.652931,-0.406108 1.294565,-0.827615 1.925781,-1.261719 0.63046,-0.433583 1.253785,-0.880551 1.865234,-1.34375 0.609824,-0.461969 1.208577,-0.936197 1.796875,-1.425781 0.588571,-0.489808 1.164657,-0.995171 1.728516,-1.509766 0.564767,-0.515423 1.116072,-1.041861 1.65625,-1.582031 0.540098,-0.540093 1.070501,-1.095393 1.585937,-1.660156 0.515937,-0.565316 1.017321,-1.141489 1.50586,-1.728516 0.489457,-0.588134 0.965648,-1.188863 1.427734,-1.798828 0.461191,-0.608783 0.910251,-1.226213 1.345703,-1.859375 0.434113,-0.631215 0.85562,-1.272876 1.261719,-1.925781 0.406937,-0.654252 0.795059,-1.320431 1.169922,-1.990235 0.376129,-0.67206 0.738411,-1.354094 1.083984,-2.044922 0.345461,-0.690599 0.674043,-1.388686 0.988281,-2.097656 0.314228,-0.708942 0.612867,-1.42887 0.894532,-2.154297 0.281232,-0.724312 0.547942,-1.456165 0.796875,-2.199218 0.248957,-0.743127 0.479493,-1.492741 0.693359,-2.248047 0.213803,-0.75508 0.412202,-1.518315 0.591797,-2.291016 0.179244,-0.77119 0.341167,-1.549685 0.484375,-2.333984 0.143435,-0.785548 0.266898,-1.579535 0.373047,-2.375 0.106364,-0.79707 0.193226,-1.596391 0.261719,-2.404297 0.06848,-0.807606 0.118601,-1.62211 0.148437,-2.441406 L 100,51.021484 Z"
                />
                <path
                    className={classes.sliceInner}
                    d="m 51.777687,59.826384 v 39.38766 c 0.806599,-0.02939 1.608899,0.07612 2.405445,-0.146633 0.796143,-0.06751 1.585448,-0.153333 2.370242,-0.258075 0.784796,-0.104741 1.564443,-0.228438 2.336997,-0.369516 0.772555,-0.141073 1.538462,-0.298574 2.297884,-0.475091 0.759421,-0.176518 1.51142,-0.371556 2.256817,-0.582623 0.745393,-0.211066 1.485269,-0.437609 2.215746,-0.682334 0.730478,-0.244722 1.452189,-0.508466 2.166856,-0.785954 0.714667,-0.277486 1.421956,-0.57044 2.11992,-0.879801 0.697965,-0.309357 1.38675,-0.635259 2.067118,-0.9756 0.680369,-0.340338 1.35048,-0.695109 2.01236,-1.065535 0.661882,-0.370426 1.315102,-0.755849 1.957602,-1.155471 0.642499,-0.399619 1.274749,-0.813572 1.896976,-1.241494 0.622229,-0.427922 1.235289,-0.868278 1.836353,-1.32361 0.601063,-0.455332 1.190853,-0.923873 1.769859,-1.405725 0.579006,-0.481847 1.147312,-0.97841 1.703368,-1.485884 0.556056,-0.507473 1.098796,-1.026017 1.631009,-1.558222 0.532213,-0.532208 1.055081,-1.078428 1.562561,-1.634473 0.507478,-0.556047 1.000527,-1.123908 1.48238,-1.702902 0.481851,-0.578994 0.950777,-1.170281 1.406109,-1.771331 0.455333,-0.601048 0.898008,-1.209727 1.325928,-1.831938 0.427922,-0.622213 0.842219,-1.255929 1.241836,-1.898413 0.399616,-0.642482 0.783412,-1.295203 1.15383,-1.957065 0.370421,-0.661861 0.725497,-1.333419 1.065827,-2.013764 0.340331,-0.680345 0.664563,-1.368613 0.973913,-2.066553 0.309349,-0.697936 0.604519,-1.406654 0.881996,-2.121294 0.277476,-0.714639 0.539504,-1.435816 0.784214,-2.166264 0.244709,-0.730445 0.471469,-1.469776 0.682521,-2.21514 0.21105,-0.745361 0.406282,-1.496811 0.582782,-2.256198 0.1765,-0.759385 0.336122,-1.526694 0.477178,-2.29921 0.141056,-0.772517 0.262941,-1.551603 0.367661,-2.336357 0.104721,-0.784754 0.190654,-1.573494 0.258146,-2.369594 0.0675,-0.796102 0.117301,-1.598231 0.146673,-2.404786 H 59.842771 a 10.012908,10.010166 0 0 1 -0.0528,0.46336 10.012908,10.010166 0 0 1 -0.74119,2.115431 10.012908,10.010166 0 0 1 -1.192945,1.898412 10.012908,10.010166 0 0 1 -1.586028,1.585595 10.012908,10.010166 0 0 1 -1.898932,1.192618 10.012908,10.010166 0 0 1 -2.116014,0.740986 10.012908,10.010166 0 0 1 -0.477177,0.05279 z"
                />
            </g>
            <g
                className={`${classes.sliceGroup} ${activeValue && activeValue === 3 ? classes.active : ''}`}
                onClick={() => {
                    if (!readonly) {
                        onSliceClick?.(3);
                    }
                }}
            >
                <path
                    className={classes.sliceContainer}
                    d="M 50 59.300781 A 9.3000002 9.3000002 0 0 1 47.126953 58.845703 A 9.3000002 9.3000002 0 0 1 44.533203 57.523438 A 9.3000002 9.3000002 0 0 1 42.476562 55.466797 A 9.3000002 9.3000002 0 0 1 41.154297 52.873047 A 9.3000002 9.3000002 0 0 1 40.699219 50 L 0.099609375 50 A 49.900002 49.900002 0 0 0 50 99.900391 L 50 59.300781 z "
                />
                <path
                    className={classes.sliceBorder}
                    d="m 0.02929688,51.021484 0.02929687,0.783204 c 0.02980347,0.818425 0.07793042,1.625922 0.14648437,2.441406 0.0685957,0.809119 0.15747527,1.608478 0.26367188,2.404297 0.10614955,0.795465 0.22961124,1.589451 0.37304688,2.375 0.14320766,0.784299 0.30513162,1.562795 0.48437502,2.333984 0.1795944,0.772702 0.3779945,1.535937 0.5917969,2.291016 0.2138661,0.755306 0.4444016,1.50492 0.6933593,2.248047 0.2489328,0.743054 0.5156436,1.474906 0.796875,2.199218 0.2812174,0.724276 0.5778954,1.444329 0.8925781,2.154297 0.3146865,0.709982 0.6453203,1.408149 0.9902344,2.097656 0.3455748,0.690828 0.7078562,1.372862 1.0839844,2.044922 0.3748647,0.669803 0.7629836,1.335982 1.1699219,1.990235 0.4060987,0.652905 0.8276066,1.294567 1.2617187,1.925781 0.4354519,0.633161 0.8845102,1.250593 1.3457034,1.859375 0.462086,0.609966 0.938275,1.210694 1.427734,1.798828 0.488537,0.587026 0.989921,1.163199 1.50586,1.728516 0.515434,0.564762 1.045837,1.120061 1.585937,1.660156 0.540177,0.540167 1.091483,1.066608 1.65625,1.582031 0.563859,0.514595 1.139947,1.01996 1.728516,1.509766 0.588299,0.489587 1.18705,0.963812 1.796875,1.425781 0.611448,0.4632 1.234776,0.910168 1.865234,1.34375 0.631217,0.434103 1.272849,0.855612 1.925781,1.261719 0.652922,0.406104 1.316786,0.796068 1.988281,1.171875 0.671539,0.37583 1.351572,0.738129 2.042969,1.083984 0.691106,0.345712 1.391126,0.674262 2.09961,0.988281 0.70853,0.314046 1.426421,0.612675 2.152343,0.894532 0.724756,0.281406 1.458505,0.548069 2.201172,0.796875 0.741752,0.248501 1.489154,0.480979 2.246094,0.695312 0.757,0.214354 1.523901,0.41063 2.294922,0.589844 0.772172,0.179481 1.548701,0.339381 2.332031,0.482422 0.784454,0.143251 1.578267,0.268665 2.375,0.375 0.795911,0.106225 1.595142,0.195054 2.404297,0.263672 0.80773,0.06849 1.624138,0.118583 2.443359,0.148437 L 49.007812,100 V 59.132812 l -0.6875,-0.0625 c -0.123178,-0.01103 -0.246526,-0.02505 -0.36914,-0.04102 -0.670009,-0.154514 -1.321034,-0.37976 -1.939453,-0.677735 -0.624056,-0.300364 -1.211462,-0.67111 -1.753907,-1.103515 -0.541926,-0.432018 -1.034425,-0.924722 -1.466796,-1.466797 -0.432306,-0.542021 -0.802778,-1.129418 -1.103516,-1.753906 -0.297951,-0.618033 -0.523244,-1.267968 -0.677734,-1.9375 -0.01678,-0.126724 -0.03145,-0.253406 -0.04297,-0.38086 l -0.0625,-0.6875 z"
                />
                <path
                    className={classes.sliceInner}
                    d="M 40.211996,51.777194 H 0.81354879 c 0.0293712,0.806555 0.0772258,1.601932 0.1447178,2.404786 0.067492,0.796101 0.15538071,1.58484 0.26010081,2.369594 0.1047202,0.784754 0.2266054,1.56384 0.3676616,2.336357 0.1410561,0.772516 0.3006778,1.539825 0.4771776,2.29921 0.1764997,0.759387 0.3717318,1.510837 0.5827826,2.256198 0.2110507,0.745363 0.4378111,1.484695 0.6825204,2.21514 0.2447096,0.730448 0.5067384,1.451625 0.7842141,2.166264 0.2774758,0.71464 0.5706912,1.423358 0.8800408,2.121294 0.3093496,0.69794 0.6355364,1.386208 0.9758674,2.066553 0.3403311,0.680345 0.695407,1.351903 1.0658271,2.013764 0.3704201,0.661861 0.7542144,1.314583 1.1538313,1.957065 0.3996167,0.642484 0.8139143,1.276201 1.2418352,1.898413 0.4279207,0.622211 0.8705945,1.23089 1.3259285,1.831938 0.455332,0.60105 0.924258,1.192337 1.40611,1.771331 0.481852,0.578994 0.9749,1.146855 1.482379,1.702902 0.507479,0.556045 1.030348,1.102265 1.562561,1.634473 0.532215,0.532205 1.074954,1.050749 1.63101,1.558222 0.556056,0.507474 1.124361,1.004037 1.703368,1.485884 0.579005,0.481852 1.168795,0.950393 1.769859,1.405725 0.601063,0.455332 1.214124,0.895688 1.836351,1.32361 0.622229,0.427922 1.254476,0.841875 1.896977,1.241494 0.6425,0.399622 1.295721,0.785045 1.957602,1.155471 0.661881,0.370426 1.331992,0.725197 2.01236,1.065535 0.680368,0.340341 1.369154,0.666243 2.067118,0.9756 0.697962,0.309361 1.405254,0.602315 2.11992,0.879801 0.714667,0.277488 1.436379,0.541232 2.166856,0.785954 0.730477,0.244724 1.468395,0.471268 2.213792,0.682334 0.745394,0.211067 1.49935,0.406105 2.258771,0.582623 0.75942,0.176517 1.525331,0.334018 2.297884,0.475091 0.772555,0.141078 1.552203,0.264775 2.336997,0.369516 0.784794,0.104742 1.5741,0.190561 2.370243,0.258075 0.796144,0.06751 1.598845,0.117239 2.405444,0.146633 V 59.824429 a 10.012908,10.010166 0 0 1 -0.451753,-0.05083 10.012908,10.010166 0 0 1 -2.11601,-0.740986 10.012908,10.010166 0 0 1 -1.898932,-1.192618 10.012908,10.010166 0 0 1 -1.586029,-1.585595 10.012908,10.010166 0 0 1 -1.192945,-1.898412 10.012908,10.010166 0 0 1 -0.741189,-2.115431 10.012908,10.010166 0 0 1 -0.0528,-0.46336 z"
                />
            </g>
            <g
                className={`${classes.sliceGroup} ${activeValue && activeValue === 4 ? classes.active : ''}`}
                onClick={() => {
                    if (!readonly) {
                        onSliceClick?.(4);
                    }
                }}
            >
                <path
                    className={classes.sliceContainer}
                    d="M 41.970703,45.359375 6.8339844,25.072266 A 49.900002,49.900002 0 0 0 0.0996094,50 H 40.699219 a 9.3000002,9.3000002 0 0 1 0.455078,-2.873047 9.3000002,9.3000002 0 0 1 0.816406,-1.767578 z"
                />
                <path
                    className={classes.sliceBorder}
                    d="m 6.2050781,25.884766 -0.3671875,0.691406 c -0.2142066,0.403575 -0.4336317,0.808842 -0.6464844,1.263672 -9.044e-4,0.0018 -0.00105,0.004 -0.00195,0.0059 l -0.00586,0.0098 C 4.9775357,28.271976 4.7755309,28.690666 4.5800781,29.115234 4.3824625,29.544502 4.1922368,29.97781 4.0078125,30.410156 3.8228333,30.843803 3.6429377,31.279211 3.4707031,31.716797 3.2983535,32.154676 3.1344542,32.592835 2.9746094,33.035156 2.8153682,33.475812 2.6594014,33.92136 2.5117188,34.369141 2.3642772,34.81619 2.2241444,35.26543 2.0898438,35.714844 1.9548409,36.166607 1.8282617,36.620554 1.7070312,37.072266 1.5861004,37.522863 1.4669256,37.978136 1.3574219,38.4375 1.2479958,38.896541 1.148278,39.356818 1.0527344,39.814453 c -0.0957368,0.458556 -0.18619807,0.918592 -0.26953128,1.382813 -0.0830217,0.462484 -0.16036023,0.924876 -0.23046874,1.390625 -0.0703552,0.467389 -0.13285176,0.937543 -0.18945313,1.402343 -0.05673,0.465863 -0.10842805,0.935057 -0.15234375,1.40625 -0.0437994,0.469936 -0.0808233,0.939087 -0.11132813,1.410157 -0.03053774,0.471582 -0.05311292,0.943387 -0.07031249,1.416015 L 0,49.005859 h 40.806641 l 0.111328,-0.621093 c 0.09238,-0.513481 0.227285,-1.018198 0.404297,-1.507813 l 0.216796,-0.595703 z"
                />
                <path
                    className={classes.sliceInner}
                    d="m 6.5064345,26.931647 c -0.2184843,0.411635 -0.431133,0.800839 -0.6375406,1.24345 -0.2064075,0.416937 -0.4061219,0.835156 -0.6003834,1.257137 -0.1942614,0.421981 -0.3831355,0.847961 -0.5651817,1.274732 -0.1820461,0.426771 -0.3582627,0.855159 -0.5280244,1.286463 -0.1697617,0.431304 -0.3315036,0.86457 -0.4889115,1.300148 -0.1574078,0.435582 -0.3106806,0.872279 -0.4556655,1.31188 -0.144985,0.439601 -0.2840599,0.882201 -0.4165527,1.325565 -0.1324927,0.443363 -0.2575083,0.890424 -0.3774397,1.337295 -0.1199313,0.446873 -0.2349375,0.894994 -0.3422381,1.345116 -0.1073005,0.450124 -0.2065687,0.901774 -0.3011694,1.354892 -0.094601,0.453116 -0.1841363,0.906856 -0.2659679,1.362712 -0.081832,0.455857 -0.1578616,0.912193 -0.226855,1.370534 -0.068993,0.45834 -0.1297006,0.919741 -0.1857864,1.380308 -0.056085,0.460566 -0.1074758,0.921682 -0.15058467,1.384218 -0.0431096,0.462535 -0.0794531,0.925835 -0.10951618,1.390083 -0.030063,0.464251 -0.0534556,0.928287 -0.0704033,1.393994 H 40.172882 a 10.012908,10.010166 0 0 1 0.438065,-1.630562 z"
                />
            </g>
            <g
                className={`${classes.sliceGroup} ${activeValue && activeValue === 5 ? classes.active : ''}`}
                onClick={() => {
                    if (!readonly) {
                        onSliceClick?.(5);
                    }
                }}
            >
                <path
                    className={classes.sliceContainer}
                    d="M 45.373047,41.960938 25.085938,6.8261719 A 49.900002,49.900002 0 0 0 6.8339844,25.072266 L 41.970703,45.359375 a 9.3000002,9.3000002 0 0 1 0.505859,-0.826172 9.3000002,9.3000002 0 0 1 2.056641,-2.056641 9.3000002,9.3000002 0 0 1 0.839844,-0.515624 z"
                />
                <path
                    className={classes.sliceBorder}
                    d="M 24.167969,7.2558594 23.501953,7.6738281 C 23.110356,7.9190342 22.70752,8.1721154 22.310547,8.4453125 l -0.0098,0.00586 c -0.388238,0.2587349 -0.773766,0.5222919 -1.15625,0.7929687 -0.385585,0.2728707 -0.765511,0.5503802 -1.140625,0.8320314 -0.374454,0.28116 -0.745994,0.567461 -1.115234,0.861328 -0.368403,0.293198 -0.733278,0.592325 -1.091797,0.894531 -0.35821,0.301947 -0.713318,0.608568 -1.064453,0.921875 -0.351326,0.313476 -0.697002,0.632013 -1.03711,0.953125 -0.340904,0.321867 -0.67743,0.648514 -1.009765,0.980469 -0.331378,0.330999 -0.65928,0.668289 -0.982422,1.009766 -0.324415,0.342825 -0.640633,0.689865 -0.951172,1.037109 -0.312869,0.349848 -0.620615,0.703597 -0.923828,1.0625 -0.30166,0.357068 -0.602207,0.71895 -0.896484,1.087891 -0.294226,0.368872 -0.581683,0.742963 -0.863282,1.117187 -0.2830238,0.376123 -0.5595975,0.756474 -0.8320309,1.140625 -0.2724867,0.384226 -0.5387808,0.77158 -0.8007812,1.164063 -0.2594966,0.388731 -0.5208593,0.784932 -0.7734375,1.1875 l -0.4179688,0.666015 35.3691404,20.417969 0.402344,-0.535156 c 0.150811,-0.199826 0.30928,-0.390348 0.472656,-0.574219 0.177976,-0.157328 0.364214,-0.309735 0.556641,-0.455078 l 0.533203,-0.402344 z"
                />
                <path
                    className={classes.sliceInner}
                    d="m 23.903862,8.3150837 c -0.394519,0.2470358 -0.786649,0.4920429 -1.173387,0.758583 -0.386738,0.2576332 -0.769199,0.5198644 -1.147964,0.7879096 -0.378768,0.2680457 -0.753889,0.5409227 -1.124497,0.8191907 -0.370608,0.278272 -0.736814,0.560209 -1.099073,0.84852 -0.36226,0.288309 -0.719927,0.583591 -1.07365,0.881754 -0.353724,0.298165 -0.703227,0.59934 -1.048226,0.907172 -0.344998,0.30783 -0.686719,0.623093 -1.022803,0.940407 -0.336085,0.317315 -0.666486,0.637263 -0.993468,0.963871 -0.326981,0.326608 -0.650354,0.659433 -0.968045,0.995149 -0.317692,0.335721 -0.628542,0.675927 -0.936754,1.020569 -0.308213,0.344642 -0.610831,0.692605 -0.909376,1.045983 -0.298544,0.35338 -0.595264,0.711424 -0.883952,1.073357 -0.288689,0.361932 -0.570107,0.728475 -0.84875,1.098771 -0.278642,0.370299 -0.552962,0.745711 -0.821372,1.124189 -0.2684101,0.378477 -0.5301371,0.759222 -0.7881253,1.145695 -0.2579884,0.386471 -0.5133685,0.776832 -0.7607464,1.171111 l 34.1084237,19.68992 a 10.012908,10.010166 0 0 1 0.535848,-0.651051 10.012908,10.010166 0 0 1 0.639495,-0.525926 z"
                />
            </g>
            <g
                className={`${classes.sliceGroup} ${activeValue && activeValue === 6 ? classes.active : ''}`}
                onClick={() => {
                    if (!readonly) {
                        onSliceClick?.(6);
                    }
                }}
            >
                <path
                    className={classes.sliceContainer}
                    d="M 50,0.0996094 A 49.900002,49.900002 0 0 0 25.085938,6.8261719 L 45.373047,41.960938 A 9.3000002,9.3000002 0 0 1 47.126953,41.154297 9.3000002,9.3000002 0 0 1 50,40.699219 Z"
                />
                <path
                    className={classes.sliceBorder}
                    d="m 49.007812,0 -0.785156,0.03125 c -0.469022,0.01810518 -0.945526,0.039225 -1.416015,0.07421875 -0.473164,0.0316813 -0.94387,0.0727062 -1.410157,0.1171875 -0.467658,0.0446121 -0.937532,0.0942412 -1.40625,0.15234375 -0.466165,0.0577867 -0.930502,0.12219876 -1.396484,0.19335938 -0.466543,0.0712456 -0.929949,0.15067283 -1.390625,0.234375 -0.462431,0.08402 -0.925106,0.17451385 -1.384766,0.27148442 -0.4565,0.096304 -0.916153,0.1962557 -1.375,0.3066406 -0.458714,0.1103532 -0.912544,0.2296025 -1.363281,0.3515625 -0.452931,0.1225535 -0.90546,0.2512446 -1.355469,0.3867187 -0.449182,0.1352254 -0.895477,0.2756321 -1.341797,0.4238282 -0.446388,0.148219 -0.890906,0.3044403 -1.332031,0.4648437 -0.440808,0.1602897 -0.882097,0.3265212 -1.320312,0.5 -0.438553,0.1736137 -0.873332,0.3540651 -1.304688,0.5390625 -0.431626,0.1851137 -0.864192,0.3758238 -1.292969,0.5742188 -0.429194,0.1985878 -0.852338,0.403808 -1.273437,0.6132812 -0.421492,0.2096693 -0.841487,0.4254084 -1.259766,0.6484375 L 25.908203,6.2519531 46.28125,41.53125 46.876953,41.314453 c 0.490543,-0.177137 0.993763,-0.312073 1.507813,-0.404297 l 0.623046,-0.111328 z"
                />
                <path
                    className={classes.sliceInner}
                    d="m 48.251656,0.78790757 c -0.465417,0.017966 -0.930435,0.0398078 -1.394375,0.0742943 -0.463938,0.0310636 -0.926304,0.0693046 -1.388508,0.11339648 -0.462205,0.0440918 -0.924385,0.093495 -1.384598,0.15054335 -0.460215,0.057049 -0.918808,0.1197092 -1.376775,0.1896458 -0.457967,0.069936 -0.91349,0.1479483 -1.368952,0.2307031 -0.455463,0.082754 -0.910384,0.1723474 -1.363085,0.26785 C 39.52266,1.9098437 39.07174,2.0092021 38.622055,2.1173829 38.172371,2.2255637 37.722982,2.3426481 37.276571,2.4634376 36.83016,2.5842269 36.385699,2.7113562 35.94282,2.844684 35.49994,2.9780119 35.059896,3.1153262 34.620803,3.2611227 34.181711,3.406919 33.743615,3.5604234 33.308564,3.7186184 32.873516,3.8768136 32.440766,4.0407824 32.010015,4.2113063 31.579267,4.3818304 31.151348,4.5603136 30.725156,4.7430964 30.298964,4.9258794 29.87341,5.1131514 29.452031,5.3081235 29.030651,5.5030956 28.612816,5.7051616 28.196506,5.9122527 27.780197,6.1193439 27.365655,6.3324334 26.95467,6.5515738 L 46.618692,40.603736 a 10.012908,10.010166 0 0 1 1.632964,-0.437945 z"
                />
            </g>
            <g
                className={classes.buttonGroup}
                onClick={() => {
                    if (!readonly) {
                        onClear?.();
                    }
                }}
            >
                <ellipse
                    className={classes.buttonBorder}
                    cx="50.027382"
                    cy="50.013683"
                    rx="7.5096812"
                    ry="7.5076251"
                />
                <path
                    className={classes.buttonInner}
                    d="m 50.027344,43.261719 c 3.726286,0 6.753906,3.02702 6.753906,6.751953 0,3.724933 -3.02762,6.751953 -6.753906,6.751953 -3.726287,0 -6.753906,-3.02702 -6.753906,-6.751953 0,-3.724933 3.027619,-6.751953 6.753906,-6.751953 z"
                />
                <path
                    className={classes.buttonIcon}
                    d="M 66.722152 -0.6103136 A 0.5 0.5 0 0 0 66.626859 -0.3161463 L 66.62686 0.31638281 A 0.5 0.5 0 0 0 67.126808 0.81633028 L 69.894468 0.81633519 L 69.894473 3.5839953 A 0.5 0.5 0 0 0 70.39442 4.0839428 L 71.02695 4.0839439 A 0.5 0.5 0 0 0 71.526895 3.5839982 L 71.52689 0.81633809 L 74.29455 0.816343 A 0.5 0.5 0 0 0 74.794496 0.3163973 L 74.794495 -0.31613181 A 0.5 0.5 0 0 0 74.294548 -0.81607928 L 71.526887 -0.81608419 L 71.526883 -3.5837443 A 0.5 0.5 0 0 0 71.026935 -4.0836918 L 70.394406 -4.0836929 A 0.5 0.5 0 0 0 69.89446 -3.5837472 L 69.894465 -0.81608709 L 67.126805 -0.816092 A 0.5 0.5 0 0 0 66.722152 -0.6103136 z "
                    transform="matrix(0.70710804,0.70710553,-0.70710804,0.70710553,0,0)"
                />
            </g>
        </g>
    </svg>
);

export default ApocalypseWorldHarmPie;