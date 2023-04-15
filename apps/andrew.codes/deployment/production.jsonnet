local k = import 'github.com/jsonnet-libs/k8s-libsonnet/1.26/main.libsonnet';

local name = std.extVar('name');
local image = std.extVar('image');
local containerPort = 80;
local cacheVolumeClaimName = 'cache-pv-claim';

local andrewcodesCacheStorageClass = {
  kind: 'StorageClass',
  apiVersion: 'storage.k8s.io/v1',
  metadata: {
    name: 'azure-file',
  },
  provisioner: 'file.csi.azure.com',
  allowVolumeExpansion: true,
  mountOptions: [
    'dir_mode=0777',
    'file_mode=0777',
    'uid=0',
    'gid=0',
    'mfsymlinks',
    'cache=strict',
    'actimeo=30',
  ],
  parameters: {
    location: 'eastus',
    skuName: 'Standard_LRS',
  },
};

local cacheVolumeClaim = {
  apiVersion: 'v1',
  kind: 'PersistentVolumeClaim',
  metadata: {
    name: cacheVolumeClaimName,
  },
  spec: {
    accessModes: ['ReadWriteMany'],
    storageClassName: 'azure-file',
    resources: {
      requests: {
        storage: '25Gi',
      },
    },
  },
}
;

local appService = {
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: name,
  },
  spec: {
    selector: { name: name },
    ports: [{
      protocol: 'TCP',
      port: 80,
      targetPort: 80,
    }],
  },
}
;

local appIngress = {
  apiVersion: 'networking.k8s.io/v1',
  kind: 'Ingress',
  metadata: {
    name: name,
    annotations: { 'kubernetes.io/ingress.class': 'azure/application-gateway' },
  },
  spec: {
    rules: [{
      http: {
        paths: [{
          path: '/',
          backend: {
            service: {
              name: name,
              port: {
                number: 80,
              },
            },
          },
          pathType: 'Exact',
        }],
      },
    }],
  },
}
;

local appContainer = k.core.v1.container.new(name=name, image=image)
                     + k.core.v1.container.withImagePullPolicy('Always')
                     + k.core.v1.container.withPorts({
                       name: 'http',
                       containerPort: containerPort,
                     })
                     + { volumeMounts+: [k.core.v1.volumeMount.new('cache', '/cache',)] }

;

local deployment = k.apps.v1.deployment.new(name=name, containers=[appContainer])
                   + { spec+: {
                     template+: {
                       spec+: {
                         volumes+: [
                           k.core.v1.volume.fromPersistentVolumeClaim('cache', cacheVolumeClaimName),
                         ],
                       },
                     },
                   } }
;

[andrewcodesCacheStorageClass, cacheVolumeClaim, appService, appIngress, deployment]
